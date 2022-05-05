package com.sportshub.controller.reset.password;


import com.sportshub.entity.user.Users;
//import com.sportshub.request.resetPasswordRequest.ResetPasswordRequest;
//import com.sportshub.request.emailRequest.EmailRequest;
import com.sportshub.service.user.UsersService;
import net.bytebuddy.utility.RandomString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;


import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import javax.servlet.http.HttpServletRequest;
import java.io.UnsupportedEncodingException;


@Controller
public class ResetPasswordController {
    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private UsersService userService;

    @CrossOrigin("*")
    @PostMapping("/forgot_password")
    public ResponseEntity<?> processForgotPassword(@RequestParam String email) {
        String token = RandomString.make(30);
        try {
            userService.updateResetPasswordToken(token, email);
            String resetPasswordLink = "http://localhost:4200/reset_password?token=" + token;
            sendEmail(email, resetPasswordLink);
        } catch (UnsupportedEncodingException | MessagingException e) {

            return new ResponseEntity<>("Failed to send an email", HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(userService.loadUserByUsername(email), HttpStatus.OK);
    }

    public void sendEmail(String recipientEmail, String link)
            throws MessagingException, UnsupportedEncodingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);
        helper.setFrom("sportshub.help@gmail.com", "SportsHub Support");
        helper.setTo(recipientEmail);

        String subject = "Here's the link to reset your password";
        String content = "<p>Hello,</p>"
                + "<p>You have requested to reset your password.</p>"
                + "<p>Click the link below to change your password:</p>"
                + "<p><a href=\"" + link + "\">Change my password</a></p>"
                + "<br>"
                + "<p>Ignore this email if you do remember your password, "
                + "or you have not made the request.</p>";

        helper.setSubject(subject);
        helper.setText(content, true);
        mailSender.send(message);
    }
//    @CrossOrigin("*")
//    @GetMapping("/reset_password")
//    public ResponseEntity<String> showResetPasswordForm(@Param(value = "token") String token, Model model) {
//        Users customer = userService.getByResetPasswordToken(token);
//        model.addAttribute("token", token);
//
//        if (customer == null) {
//            return new ResponseEntity<>("ERROR", HttpStatus.NOT_FOUND);
//        }
//
//        return new ResponseEntity<>("Everything is ok", HttpStatus.OK);
//    }

    @CrossOrigin("*")
    @PostMapping("/reset_password")
    public  ResponseEntity<String> processResetPassword(@RequestParam String token, String newPassword, String confirmPassword) {
//        String token = resetPasswordRequest.getToken();
//        String newPassword = resetPasswordRequest.getNewPassword();
//        String confirmPassword = resetPasswordRequest.getConfirmPassword();
        if (confirmPassword.equals(newPassword)) {
            Users user = userService.getByResetPasswordToken(token);
            if (user != null) {
                userService.updatePassword(user, newPassword);
//                System.out.println(user.getPassword());
            }
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }
}