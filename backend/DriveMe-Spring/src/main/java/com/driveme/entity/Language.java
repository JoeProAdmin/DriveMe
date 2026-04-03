package com.driveme.entity;

public enum Language {

    FR("Français"),
    EN("English"),
    AR("العربية");

    private String label;

    Language(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}