package com.example.demo.util;

import com.example.demo.exception.FileProcessingException;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.List;

public class FileProcessingUtil {

    public static List<Double> filProcessor(MultipartFile file){
        double lmean=0.0,rmean=0.0,avg;
        try{
            BufferedReader reader=new BufferedReader(new InputStreamReader(file.getInputStream()));
            String line;
            int index=0;
            double [] pressurePoints=new double[10];
            while((line=reader.readLine())!=null){
                if(index>4){
                    String[] arr = line.trim().split("\\s+");
                    for(int i=1;i<arr.length;i++){
                        if(Double.parseDouble(arr[i])>pressurePoints[i-1])
                            pressurePoints[i-1] = Double.parseDouble(arr[i]);
                    }
                }
                index++;
            }
            double[] norm = {1559.9401, 1554.3851, 1549.3752, 1545.2885, 1542.5413,
                    1559.7816, 1553.9641, 1549.3252, 1546.7133, 1542.9034};
            for (int i = 0; i < 10; i++) {
                pressurePoints[i] = norm[i] - pressurePoints[i];
                pressurePoints[i] = 6.4474 * pressurePoints[i] * 98.0665;
            }
            for(int i=0;i<5;i++){
                lmean+=pressurePoints[i];
            }
            lmean=lmean/5;
            for(int j=5;j<10;j++){
                rmean+=pressurePoints[j];
            }
            rmean=rmean/5;
            avg=(rmean+lmean)/2;
            reader.close();
        }catch(IOException e){
            throw new FileProcessingException("Some error with the file");
        }

        return List.of(lmean,rmean,avg);
    }
}
