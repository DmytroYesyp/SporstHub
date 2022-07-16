package com.sportshub.dto.page.content;

import lombok.Data;

@Data
public class PageContentDto {
    private Long id;
    private String title;
    private String headline;
    private String text;
    private String address;
    private String tel;
    private String email;
}
