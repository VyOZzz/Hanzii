package com.vy.hanzi.hanzi_srs_dictionary.service;

public interface AIAssistantService {
    String chatWithTutor(String message);

    Integer classifyHskLevel(String hanzi, String pinyin, String meaning);
}
