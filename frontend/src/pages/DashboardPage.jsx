import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line, Legend } from 'recharts';
import { Footprints, ActivitySquare, Search, UploadCloud, File, X, AlertCircle, FileDown, Mail } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';
import footImage from '../assets/foot_image.jpg';

const getFootType = (s) => {
  if (
    s[0] >= 50 && s[0] <= 300 &&
    s[1] >= 20 && s[1] <= 200 &&
    s[2] >= 40 && s[2] <= 250 &&
    s[3] >= 40 && s[3] <= 250 &&
    s[4] >= 50 && s[4] <= 300
  ) return "Normal";

  if (
    s[0] >= 100 && s[0] <= 250 &&
    s[1] >= 200 && s[1] <= 300 &&
    s[2] >= 100 && s[2] <= 250 &&
    s[3] >= 100 && s[3] <= 250 &&
    s[4] >= 100 && s[4] <= 250
  ) return "Flat";

  if (
    s[0] >= 250 && s[0] <= 300 &&
    s[1] >= 100 && s[1] <= 200 &&
    s[2] >= 150 && s[2] <= 300 &&
    s[3] >= 100 && s[3] <= 200 &&
    s[4] >= 100 && s[4] <= 300
  ) return "Pronated";

  if (
    s[0] >= 250 && s[0] <= 300 &&
    s[1] >= 50 && s[1] <= 100 &&
    s[2] >= 100 && s[2] <= 200 &&
    s[3] >= 200 && s[3] <= 300 &&
    s[4] >= 80 && s[4] <= 150
  ) return "Supinated";

  return "Abnormal";
};

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('search'); // 'search' or 'upload'
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const canvasRef = useRef(null);
  const reportRef = useRef(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [emailSending, setEmailSending] = useState(false);

  // Search State
  const [searchPhone, setSearchPhone] = useState('');

  // Upload State
  const [uploadData, setUploadData] = useState({
    name: '',
    email: '',
    phoneNumber: ''
  });
  const [file, setFile] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchPhone) {
      toast.error('Please enter a phone number');
      return;
    }

    setLoading(true);
    setError(null);
    setPatientData(null);

    try {
      const res = await api.get('/patient', {
        params: { phoneNumber: searchPhone }
      });

      if (res.data) {
        const fallback = [50, 60, 70, 80, 90, 55, 65, 75, 85, 95];
        setPatientData({
          ...res.data,
          maxValues: res.data.maxValues || fallback
        });
        toast.success('Patient found');
      } else {
        setError('No patient found with this phone number.');
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError('No patient found with this phone number.');
      } else {
        setError('An error occurred while fetching patient data.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUploadChange = (e) => {
    const { name, value } = e.target;
    setUploadData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const clearFile = () => {
    setFile(null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadData.name || !uploadData.email || !uploadData.phoneNumber || !file) {
      toast.error('Please fill all fields and select a file');
      return;
    }

    const payload = new FormData();
    payload.append('name', uploadData.name);
    payload.append('email', uploadData.email);
    payload.append('phoneNumber', uploadData.phoneNumber);
    payload.append('file', file);

    setLoading(true);
    setError(null);
    setPatientData(null);

    try {
      const res = await api.post('/patient', payload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Construct a patientDetail response equivalent using the form inputs and the response metrics
      if (res.data) {
        const fallback = [50, 60, 70, 80, 90, 55, 65, 75, 85, 95];
        setPatientData({
          name: uploadData.name,
          email: uploadData.email,
          phoneNumber: uploadData.phoneNumber,
          lmean: res.data.lmean,
          rmean: res.data.rmean,
          avg: res.data.avg,
          maxValues: res.data.maxValues || fallback
        });
        toast.success('Data uploaded and analyzed successfully');

        // Reset form
        setUploadData({ name: '', email: '', phoneNumber: '' });
        setFile(null);
      }
    } catch (error) {
      setError('Failed to upload and analyze data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const chartData = patientData ? [
    { name: 'Left Foot', value: patientData.lmean, color: '#3b82f6' },
    { name: 'Right Foot', value: patientData.rmean, color: '#ef4444' },
    { name: 'Average', value: patientData.avg, color: '#10b981' }
  ] : [];

  const sensorData = patientData?.maxValues ? [
    { sensor: "Heel", left: patientData.maxValues[0], right: patientData.maxValues[5] },
    { sensor: "Midfoot", left: patientData.maxValues[1], right: patientData.maxValues[6] },
    { sensor: "Forefoot", left: patientData.maxValues[2], right: patientData.maxValues[7] },
    { sensor: "Toes", left: patientData.maxValues[3], right: patientData.maxValues[8] },
    { sensor: "Hallux", left: patientData.maxValues[4], right: patientData.maxValues[9] }
  ] : [];

  let leftType = "N/A";
  let rightType = "N/A";
  let overallType = "N/A";

  if (patientData?.maxValues) {
    const leftFoot = patientData.maxValues.slice(0, 5);
    const rightFoot = patientData.maxValues.slice(5, 10);
    leftType = getFootType(leftFoot);
    rightType = getFootType(rightFoot);
    overallType = leftType === "Normal" && rightType === "Normal" ? "Normal" : "Abnormal";
  }

  useEffect(() => {
    if (patientData && patientData.maxValues && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = footImage;
      img.onload = () => {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the background image to fit the canvas
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Base image dimensions used for the coordinates
        const baseWidth = 736;
        const baseHeight = 736;

        const scaleX = canvas.width / baseWidth;
        const scaleY = canvas.height / baseHeight;

        const points = [
          { x: 123, y: 330 }, { x: 270, y: 620 }, { x: 260, y: 200 },
          { x: 250, y: 500 }, { x: 280, y: 280 },
          { x: 460, y: 280 }, { x: 470, y: 180 },
          { x: 460, y: 600 }, { x: 490, y: 480 }, { x: 610, y: 320 }
        ];

        const sensorLabels = ["Heel", "Midfoot", "Forefoot", "Toes", "Hallux"];
        const sensorRanges = {
          Heel: [50, 300],
          Midfoot: [20, 200],
          Forefoot: [40, 250],
          Toes: [40, 250],
          Hallux: [50, 300]
        };

        points.forEach((point, index) => {
          const val = patientData.maxValues[index];
          let color = "gray";

          if (val !== null && !isNaN(val)) {
            const label = sensorLabels[index % 5];
            const [min, max] = sensorRanges[label];
            if (val >= min && val <= max) color = "green";
            else color = "red";
          }

          ctx.beginPath();
          ctx.arc(point.x * scaleX, point.y * scaleY, 10, 0, 2 * Math.PI, false);
          ctx.fillStyle = color;
          ctx.fill();
          ctx.lineWidth = 2;
          ctx.strokeStyle = '#ffffff';
          ctx.stroke();

          // Draw the value
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 12px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(Math.round(val), point.x * scaleX, point.y * scaleY);
        });
      };
    }
  }, [patientData]);

  const generateReportPdfBlob = async () => {
    if (!reportRef.current || !patientData) {
      throw new Error('No report to export');
    }
    reportRef.current.scrollIntoView({ block: 'start', behavior: 'auto' });
    await new Promise((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(resolve));
    });

    const liveRoot = reportRef.current;
    const canvas = await html2canvas(liveRoot, {
      scale: 1.5,
      useCORS: true,
      allowTaint: false,
      foreignObjectRendering: false,
      backgroundColor: '#ffffff',
      logging: false,
      imageTimeout: 20000,
      ignoreElements: (el) =>
        el instanceof HTMLElement && el.classList.contains('recharts-tooltip-wrapper'),
      onclone(clonedDoc) {
        const cloneRoot = clonedDoc.querySelector('[data-pdf-report]');
        if (!cloneRoot) return;
        cloneRoot.querySelector('[data-pdf-exclude-bar]')?.remove();
        const liveCanvases = liveRoot.querySelectorAll('canvas');
        const cloneCanvases = cloneRoot.querySelectorAll('canvas');
        liveCanvases.forEach((liveCanvas, i) => {
          const placeholder = cloneCanvases[i];
          if (!placeholder?.parentNode) return;
          try {
            const url = liveCanvas.toDataURL('image/png');
            const imgEl = clonedDoc.createElement('img');
            imgEl.src = url;
            imgEl.width = liveCanvas.width;
            imgEl.height = liveCanvas.height;
            imgEl.style.width = `${liveCanvas.width}px`;
            imgEl.style.height = `${liveCanvas.height}px`;
            placeholder.parentNode.replaceChild(imgEl, placeholder);
          } catch {
            /* keep cloned canvas */
          }
        });
      },
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.92);
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
    const pageWidth =
      typeof pdf.internal.pageSize.getWidth === 'function'
        ? pdf.internal.pageSize.getWidth()
        : pdf.internal.pageSize.width;
    const pageHeight =
      typeof pdf.internal.pageSize.getHeight === 'function'
        ? pdf.internal.pageSize.getHeight()
        : pdf.internal.pageSize.height;
    const marginMm = 10;
    const contentWidth = pageWidth - 2 * marginMm;
    const contentHeight = pageHeight - 2 * marginMm;
    const imgWidth = contentWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let y = 0;
    if (imgHeight <= contentHeight) {
      pdf.addImage(imgData, 'JPEG', marginMm, marginMm, imgWidth, imgHeight);
    } else {
      while (y < imgHeight) {
        if (y > 0) pdf.addPage('a4', 'p');
        pdf.addImage(imgData, 'JPEG', marginMm, marginMm - y, imgWidth, imgHeight);
        y += contentHeight;
      }
    }
    const safeName = String(patientData.phoneNumber || 'patient').replace(/[^\w.-]+/g, '_');
    const filename = `plantar-pressure-report-${safeName}.pdf`;
    const blob = pdf.output('blob');
    return { blob, filename };
  };

  const handleDownloadPdf = async () => {
    if (!reportRef.current || !patientData) return;
    setPdfLoading(true);
    try {
      const { blob, filename } = await generateReportPdfBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('PDF downloaded');
    } catch (err) {
      console.error('PDF export failed:', err);
      toast.error('Could not create PDF. Try again.');
    } finally {
      setPdfLoading(false);
    }
  };

  const handleSendReportEmail = async () => {
    if (!patientData?.phoneNumber) {
      toast.error('Missing patient phone number');
      return;
    }
    if (!patientData?.email) {
      toast.error('Patient has no email address on file');
      return;
    }
    setEmailSending(true);
    try {
      const { blob, filename } = await generateReportPdfBlob();
      const formData = new FormData();
      formData.append('phoneNumber', patientData.phoneNumber);
      formData.append('file', blob, filename);
      await api.post('/patient/report/email', formData);
      toast.success('Report sent to patient email');
    } catch (err) {
      if (!err.response) {
        toast.error('Could not send report');
      }
    } finally {
      setEmailSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Search existing patient records or upload new plantar pressure data.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
        <div className="flex border-b border-gray-200 dark:border-slate-700">
          <button
            onClick={() => { setActiveTab('search'); setError(null); }}
            className={`flex-1 py-4 px-6 text-sm font-medium transition-colors ${activeTab === 'search'
                ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-slate-800/50'
              }`}
          >
            Search Existing Patient
          </button>
          <button
            onClick={() => { setActiveTab('upload'); setError(null); }}
            className={`flex-1 py-4 px-6 text-sm font-medium transition-colors ${activeTab === 'upload'
                ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-slate-800/50'
              }`}
          >
            Upload New Data
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'search' && (
            <form onSubmit={handleSearch} className="flex gap-4 items-end animate-in fade-in duration-300">
              <div className="flex-1 max-w-md">
                <Input
                  label="Phone Number"
                  name="searchPhone"
                  value={searchPhone}
                  onChange={(e) => setSearchPhone(e.target.value)}
                  placeholder="Enter patient phone number"
                  className="w-full"
                />
              </div>
              <Button type="submit" isLoading={loading} className="w-32">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </form>
          )}

          {activeTab === 'upload' && (
            <form onSubmit={handleUpload} className="space-y-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                  label="Full Name"
                  name="name"
                  value={uploadData.name}
                  onChange={handleUploadChange}
                  placeholder="John Doe"
                  required
                />
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={uploadData.email}
                  onChange={handleUploadChange}
                  placeholder="john@example.com"
                  required
                />
                <Input
                  label="Phone Number"
                  name="phoneNumber"
                  value={uploadData.phoneNumber}
                  onChange={handleUploadChange}
                  placeholder="+1 234 567 890"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">Plantar Pressure Data File</label>
                {!file ? (
                  <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg p-12 text-center hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors relative">
                    <input
                      type="file"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleFileChange}
                      accept=".log,.csv,.txt,.json"
                      required
                    />
                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-4 text-sm text-gray-600 dark:text-gray-300 font-medium">Click to upload or drag and drop</p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">LOG, CSV, TXT up to 10MB</p>
                  </div>
                ) : (
                  <div className="border border-gray-200 dark:border-slate-600 rounded-lg p-4 flex items-center justify-between bg-blue-50/50 dark:bg-slate-700/50">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-100 dark:border-slate-600">
                        <File className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{file.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{(file.size / 1024).toFixed(2)} KB</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={clearFile}
                      className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <Button type="submit" isLoading={loading}>
                  Upload & Analyze
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Operation Failed</h3>
            <div className="mt-1 text-sm text-red-700">
              {error}
            </div>
          </div>
        </div>
      )}

      {!patientData && !error && !loading && (
        <Card className="border-dashed border-2 bg-gray-50/50 dark:bg-slate-800/30 border-gray-200 dark:border-slate-700">
          <CardContent className="p-12 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
            <ActivitySquare className="h-12 w-12 text-gray-300 dark:text-slate-600 mb-4" />
            <p className="text-lg font-medium text-gray-600 dark:text-gray-300">No Patient Data</p>
            <p className="text-sm mt-1 text-center max-w-sm">Use the search or upload functionality above to load plantar pressure analysis records.</p>
          </CardContent>
        </Card>
      )}

      {patientData && (
        <>
          <div className="flex flex-wrap justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={handleSendReportEmail}
              isLoading={emailSending}
              disabled={pdfLoading}
              className="shrink-0"
            >
              <Mail className="w-4 h-4 mr-2" />
              Send report to patient
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleDownloadPdf}
              isLoading={pdfLoading}
              disabled={emailSending}
              className="shrink-0"
            >
              <FileDown className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
          <div
            ref={reportRef}
            data-pdf-report
            className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
          <Card>
            <CardHeader className="bg-gray-50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-700">
              <CardTitle className="text-lg">Patient Information</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</p>
                  <p className="text-base font-semibold text-gray-900 dark:text-white mt-1">{patientData.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                  <p className="text-base font-semibold text-gray-900 dark:text-white mt-1">{patientData.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone Number</p>
                  <p className="text-base font-semibold text-gray-900 dark:text-white mt-1">{patientData.phoneNumber}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-pdf-mean-stats>
            <Card className="bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-950 border-blue-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white/90">Left Mean</p>
                    <h3 className="text-3xl font-bold text-white mt-2">{patientData.lmean?.toFixed(2) || '0.00'}</h3>
                  </div>
                  <div className="p-3 bg-white/20 rounded-lg">
                    <Footprints className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-600 to-red-800 dark:from-red-700 dark:to-red-950 border-red-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white/90">Right Mean</p>
                    <h3 className="text-3xl font-bold text-white mt-2">{patientData.rmean?.toFixed(2) || '0.00'}</h3>
                  </div>
                  <div className="p-3 bg-white/20 rounded-lg">
                    <Footprints className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-600 to-emerald-800 dark:from-emerald-700 dark:to-emerald-950 border-emerald-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white/90">Average</p>
                    <h3 className="text-3xl font-bold text-white mt-2">{patientData.avg?.toFixed(2) || '0.00'}</h3>
                  </div>
                  <div className="p-3 bg-white/20 rounded-lg">
                    <ActivitySquare className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div data-pdf-exclude-bar className="contents">
            <Card>
              <CardHeader>
                <CardTitle>Pressure Distribution Graph</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="opacity-50 dark:opacity-20" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
                      <Tooltip
                        cursor={{ fill: '#f3f4f6', opacity: 0.1 }}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: 'var(--tw-colors-slate-800, #1e293b)', color: '#fff' }}
                      />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={80}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Sensor Pressure (Line Chart)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sensorData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis dataKey="sensor" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                      <Tooltip
                        cursor={{ fill: '#f3f4f6' }}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="left" name="Left Foot" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="right" name="Right Foot" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Foot Sensor Mapping</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col justify-center items-center">
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={400}
                  className="bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-lg shadow-inner mb-4"
                />
                <div className="flex space-x-6 text-sm font-medium">
                  <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                    <span className="text-gray-600 dark:text-gray-300">Normal</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                    <span className="text-gray-600 dark:text-gray-300">Abnormal</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-indigo-50 to-white dark:from-slate-800 dark:to-slate-900">
              <CardContent className="p-6">
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Left Foot Type</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{leftType}</h3>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-indigo-50 to-white dark:from-slate-800 dark:to-slate-900">
              <CardContent className="p-6">
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Right Foot Type</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{rightType}</h3>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-white dark:from-slate-800 dark:to-slate-900">
              <CardContent className="p-6">
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Overall Condition</p>
                  <h3 className={`text-2xl font-bold mt-2 ${overallType === 'Normal' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{overallType}</h3>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sensor Value Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-slate-800/50 border-b border-gray-200 dark:border-slate-700">
                    <tr>
                      <th className="px-6 py-4 font-medium">Sensor</th>
                      <th className="px-6 py-4 font-medium text-blue-600 dark:text-blue-400">Left Foot</th>
                      <th className="px-6 py-4 font-medium text-red-600 dark:text-red-400">Right Foot</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-slate-700/50">
                    {sensorData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-200">{row.sensor}</td>
                        <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{row.left.toFixed(2)}</td>
                        <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{row.right.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
