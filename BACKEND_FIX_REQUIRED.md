# 🔧 Yêu cầu sửa Backend - Review Update Permission

## ❌ Vấn đề hiện tại

Khi user cố gắng chỉnh sửa review, backend trả về lỗi:
```
PUT /api/reviews/{id} 400 (Bad Request)
Error: "Failed to evaluate expression 'hasRole('ADMIN') or @reviewService.isReviewOwner(#id)'"
```

## 🔍 Nguyên nhân

File `ReviewAPI.java` đang sử dụng annotation `@PreAuthorize` với expression:
```java
@PreAuthorize("hasRole('ADMIN') or @reviewService.isReviewOwner(#id)")
```

Nhưng method `isReviewOwner(Long reviewId)` **chưa được implement** trong class `ReviewService.java`.

## ✅ Giải pháp - Cần sửa ở Backend

### Bước 1: Thêm imports vào `ReviewService.java`

Thêm các imports sau vào đầu file:
```java
import com.example.web_petvibe.entity.Account;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
```

### Bước 2: Thêm method `isReviewOwner` vào `ReviewService.java`

Thêm method sau vào cuối class `ReviewService` (trước dấu `}` cuối cùng):

```java
/**
 * Kiểm tra xem user hiện tại có phải là owner của review không
 * Method này được sử dụng trong @PreAuthorize expression
 * 
 * @param reviewId ID của review cần kiểm tra
 * @return true nếu user hiện tại là owner của review, false nếu không
 */
public boolean isReviewOwner(Long reviewId) {
    try {
        // Lấy authentication từ SecurityContext
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        // Lấy Account từ principal (được set trong Filter.java)
        Object principal = authentication.getPrincipal();
        if (!(principal instanceof Account)) {
            return false;
        }

        Account currentAccount = (Account) principal;
        Long currentUserId = currentAccount.getId();

        // Lấy review và kiểm tra userId
        Optional<Review> review = reviewRepository.findByIdActive(reviewId);
        if (review.isEmpty()) {
            return false;
        }

        Review reviewEntity = review.get();
        return reviewEntity.getUserId().equals(currentUserId);
    } catch (Exception e) {
        // Nếu có lỗi, trả về false để đảm bảo security (fail-safe)
        return false;
    }
}
```

### Bước 3: Rebuild và restart Backend

```bash
mvn clean install
# hoặc
./mvnw clean install
```

Sau đó restart Spring Boot application.

## 📋 File cần sửa

**File:** `EXE201-BE/src/main/java/com/example/web_petvibe/service/ReviewService.java`

**Vị trí:** Thêm method `isReviewOwner` vào cuối class (sau method `deleteReview`)

## 🔐 Cách hoạt động

1. Spring Security đánh giá expression: `hasRole('ADMIN') or @reviewService.isReviewOwner(#id)`
   - Nếu user là **ADMIN** → Cho phép ngay lập tức
   - Nếu không phải ADMIN → Gọi `isReviewOwner(reviewId)`
     - Lấy user hiện tại từ `SecurityContext`
     - So sánh `userId` của review với `id` của user hiện tại
     - Trả về `true` nếu match → Cho phép chỉnh sửa

2. **Bảo mật:**
   - Nếu không authenticated → `false`
   - Nếu review không tồn tại → `false`
   - Nếu có exception → `false` (fail-safe)

## ✅ Kết quả sau khi sửa

- User chỉ có thể chỉnh sửa review của chính họ
- Admin có thể chỉnh sửa tất cả reviews
- Không còn lỗi "Failed to evaluate expression"
- API PUT `/api/reviews/{id}` hoạt động đúng

## 📝 Lưu ý

- Method này **bắt buộc phải có** để `@PreAuthorize` expression hoạt động
- Nếu không có method này, Spring Security sẽ không thể đánh giá expression và trả về lỗi 400
- Method phải là `public` và trả về `boolean`
- Method phải được đặt trong `@Service` class để Spring có thể inject vào expression

