package com.example.demo.dto;

import java.util.List;

public class PressureResponse {
    private double lmean;
    private double rmean;
    private double avg;
    private List<Double> maxValues;

    public PressureResponse() {}

    public PressureResponse(double lmean, double rmean, double avg, List<Double> maxValues) {
        this.lmean = lmean;
        this.rmean = rmean;
        this.avg = avg;
        this.maxValues = maxValues;
    }

    public double getLmean() {
        return lmean;
    }

    public void setLmean(double lmean) {
        this.lmean = lmean;
    }

    public double getRmean() {
        return rmean;
    }

    public void setRmean(double rmean) {
        this.rmean = rmean;
    }

    public double getAvg() {
        return avg;
    }

    public void setAvg(double avg) {
        this.avg = avg;
    }

    public List<Double> getMaxValues() {
        return maxValues;
    }

    public void setMaxValues(List<Double> maxValues) {
        this.maxValues = maxValues;
    }
}
