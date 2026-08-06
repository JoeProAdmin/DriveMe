package com.driveme.entity;

public enum Language {

    FR("Français"),
    EN("English"),
    AR("العربية"),
    ES("Español");

    private final String label;

    Language(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}