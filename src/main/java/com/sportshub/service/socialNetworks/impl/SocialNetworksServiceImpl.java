package com.sportshub.service.socialNetworks.impl;

import com.sportshub.entity.socialNetworks.socialFollow.socialFollow;
import com.sportshub.entity.socialNetworks.socialShare.socialShare;
import com.sportshub.repository.socialNetworks.socialFollowRepository;
import com.sportshub.repository.socialNetworks.socialShareRepository;
import com.sportshub.service.socialNetworks.SocialNetworksService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SocialNetworksServiceImpl implements SocialNetworksService {

    private final socialFollowRepository followRepository;
    private final socialShareRepository shareRepository;

    @Autowired
    public SocialNetworksServiceImpl(socialFollowRepository followRepository, socialShareRepository shareRepository) {
        this.followRepository = followRepository;
        this.shareRepository = shareRepository;
    }


    public ResponseEntity<List<socialFollow>> getAllFollow(){
        return  ResponseEntity.ok().body(followRepository.findAll());
    }
    public ResponseEntity<List<socialShare>> getAllShare(){



        return  ResponseEntity.ok().body(shareRepository.findAll());
    }


    public ResponseEntity<socialShare> addNewShare(socialShare share){
        shareRepository.save(share);
        return ResponseEntity.ok(share);
    }
    public ResponseEntity<socialFollow>addNewFollow(socialFollow follow){
        followRepository.save(follow);
        return ResponseEntity.ok(follow);
    }

    public ResponseEntity<String> deleteShare(long id){

        if (shareRepository.findAll().isEmpty())
            return new ResponseEntity<String>(
                "There is no social follow with such id", new HttpHeaders(), HttpStatus.NOT_FOUND);

        shareRepository.deleteById(id);
        return ResponseEntity.ok("deleted social share entity by id " + id);
    }

    public ResponseEntity<String> deleteFollow(long id){
        if (followRepository.findAll().isEmpty())
            return new ResponseEntity<String>(
                    "There is no social follow with such id", new HttpHeaders(), HttpStatus.NOT_FOUND);

        followRepository.deleteById(id);
        return ResponseEntity.ok("deleted social follow entity by id " + id);
    }

}
