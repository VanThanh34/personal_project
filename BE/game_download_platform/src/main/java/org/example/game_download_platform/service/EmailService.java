package org.example.game_download_platform.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendVerificationEmail(String toEmail, String token) {
        String subject = "Xác thực tài khoản Game Download Platform";
        String confirmationUrl = "http://localhost:5173/verify-account?token=" + token;

        String content = "<div style='font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;'>"
                + "<div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);'>"
                + "<h2 style='color: #333; text-align: center;'>Chào mừng bạn đến với Game Download Platform!</h2>"
                + "<p style='font-size: 16px; color: #555;'>Cảm ơn bạn đã đăng ký tài khoản. Vui lòng nhấn vào nút bên dưới để kích hoạt tài khoản của bạn:</p>"
                + "<div style='text-align: center; margin: 30px 0;'>"
                + "<a href='" + confirmationUrl
                + "' style='background-color: #ec4899; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;'>KÍCH HOẠT TÀI KHOẢN</a>"
                + "</div>"
                + "<p style='font-size: 14px; color: #999; text-align: center;'>Link này sẽ hết hạn sau 24 giờ.</p>"
                + "</div>"
                + "</div>";

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(content, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Không thể gửi email xác thực: " + e.getMessage());
        }
    }
}
