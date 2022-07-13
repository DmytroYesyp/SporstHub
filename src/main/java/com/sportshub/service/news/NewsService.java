package com.sportshub.service.news;

import com.sportshub.dto.count.CountDto;
import com.sportshub.dto.news.NewsCreateDto;
import com.sportshub.dto.news.NewsDto;
import com.sportshub.dto.news.NewsSearchFilters;
import com.sportshub.dto.news.NewsUpdateDto;

import java.util.List;

public interface NewsService {
    NewsDto create(NewsCreateDto newsDto);
    List<NewsDto> findAll(NewsSearchFilters newsSearchFilters, int limit, Integer page);
    List<NewsDto> findPopular(int limitDate);
    List<NewsDto> findCommented(int limitDate);
    CountDto getCount(NewsSearchFilters newsSearchFilters);
    NewsDto find(Long id);
    void update(Long id, NewsUpdateDto newsDto);
    void delete(Long id);


}
