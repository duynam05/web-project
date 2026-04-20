# Session Notes

## Project Summary
- Project path: `D:\tam1\web-project`
- Backend app: Spring Boot project at `backend/project-web`
- Frontend app: React app at `Frontend/bookstore-ui`
- Current architecture:
  - Backend API runs on `http://localhost:8080`
  - Frontend runs on `http://localhost:3000`
  - MySQL runs through Docker on host port `3307`

## Recommended Run Setup
- Recommended day-to-day workflow:
  - Run MySQL with Docker
  - Run backend in IntelliJ for debugging
  - Run frontend with `npm start`

### MySQL Only
- Working directory:
  - `D:\tam1\web-project\backend\project-web`
- Run:

```powershell
docker compose up -d mysql
```

### Backend in IntelliJ
- Project:
  - `D:\tam1\web-project\backend\project-web`
- Java version:
  - `21`
- Important environment values for local IntelliJ run:

```text
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3307/bookstore1
SPRING_DATASOURCE_DRIVER_CLASS_NAME=com.mysql.cj.jdbc.Driver
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=root
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SPRING_JPA_SHOW_SQL=true
JWT_SIGNER_KEY=1TjXchw5FloESb63Kc+DFhTARvpWL4jUGCwfGWxuG5SIf/1y/LgJxHnMqaF6A/ij
JWT_VALID_DURATION=360000
JWT_REFRESHABLE_DURATION=36000
APP_BOOTSTRAP_ADMIN_ENABLED=true
APP_BOOTSTRAP_ADMIN_EMAIL=admin@admin.com
APP_BOOTSTRAP_ADMIN_PASSWORD=12345678
APP_BOOTSTRAP_ADMIN_FULL_NAME=Administrator
```

### Frontend
- Working directory:
  - `D:\tam1\web-project\Frontend\bookstore-ui`
- Run:

```powershell
npm start
```

- Frontend env:
  - `.env` uses:

```text
REACT_APP_API_BASE_URL=http://localhost:8080
```

## Docker Notes
- MySQL container name: `bookstore-mysql`
- App container name: `bookstore-app`
- App port: `8080`
- MySQL exposed port on host: `3307`
- Default MySQL credentials from `docker-compose.yml`:
  - username: `root`
  - password: `root`
  - database: `bookstore1`

## MySQL Connection
- Host: `localhost`
- Port: `3307`
- Username: `root`
- Password: `root`
- Database: `bookstore1`

## Important Fixes Applied

### Docker Script Fix
- Problem encountered:
  - `bookstore-app` kept restarting with:
  - `/usr/bin/env: 'bash\r': No such file or directory`
- Cause:
  - `wait-for-it.sh` had Windows CRLF line endings
- Fix applied in `backend/project-web/Dockerfile`:

```dockerfile
RUN sed -i 's/\r$//' /wait-for-it.sh && chmod +x /wait-for-it.sh
```

### Frontend API Alignment
- Frontend previously used old backend URLs such as:
  - `http://localhost:8181/identity`
  - `http://localhost:8090/api/books/...`
- Frontend was updated to use a shared API config:
  - `Frontend/bookstore-ui/src/config/api.js`
- Frontend now builds API URLs from:
  - `REACT_APP_API_BASE_URL`

### Static Upload Removal
- Local static upload serving was removed from the backend
- `StaticResourceConfig` was deleted
- Security config no longer exposes:
  - `GET /uploads/**`
- `application.yaml` no longer uses:
  - `app.images.directory`
- Result:
  - image handling now assumes Cloudinary-based URLs instead of backend-served local upload paths

### User Profile Response Fix
- `PUT /users/me` supports updating:
  - `fullName`
  - `phone`
  - `address`
- `UserResponse` was updated to return:
  - `phone`
  - `address`
- Result:
  - `GET /users/my-info` now returns profile fields needed by the frontend account page

## Current API Base URL

```text
http://localhost:8080
```

## Auth and Token
- Login endpoint:
  - `POST /auth/token`
- Register endpoint:
  - `POST /auth/register`
- Use Bearer token for protected endpoints:

```text
Authorization: Bearer <token>
```

## Functional API Groups

### Auth
- `POST /auth/register`
- `POST /auth/token`
- `POST /auth/introspect`
- `POST /auth/refresh`
- `POST /auth/logout`
- `POST /auth/change-password`

### Users
- `POST /users`
- `GET /users`
- `GET /users/{userId}`
- `GET /users/my-info`
- `PUT /users/me`
- `PUT /users/{userId}`
- `PATCH /users/{userId}/status`
- `DELETE /users/{userId}`

### Books
- `GET /books`
- `GET /books/{id}`
- `POST /books`
- `POST /books/upload-image`

### Cart
- `GET /cart`
- `POST /cart`
- `PUT /cart/{id}`
- `DELETE /cart/{id}`
- `DELETE /cart/clear`

### Orders
- `POST /api/orders`
- `GET /api/orders`
- `GET /api/orders/{orderId}`
- `POST /api/orders/{orderId}/payment`

### Permissions
- `POST /permissions`
- `GET /permissions`
- `DELETE /permissions/{permission}`

### Roles
- `POST /roles`
- `GET /roles`
- `DELETE /roles/{role}`

## Frontend Status
- Frontend exists and is actively connected to backend
- Main frontend flows updated:
  - home
  - login
  - register
  - book list
  - book detail
  - cart
  - account page
- Frontend now uses:
  - `src/config/api.js`
  - `buildApiUrl(...)`
  - `resolveImageUrl(...)`
  - `resolveAvatarUrl(...)`

## Search Status
- Search is now backend-driven instead of frontend-only filtering
- `GET /books` supports query params:
  - `q`
  - `category`
  - `sort`
  - `page`
  - `size`
- Current supported sorts in backend:
  - `popular`
  - `rating`
  - `price_asc`
  - `price_desc`
  - `title_asc`
  - `title_desc`
- Backend implementation notes:
  - `BookRepository` now implements `JpaSpecificationExecutor<Book>`
  - search/filter logic lives in `repository/specification/BookSpecifications.java`
  - paginated response DTO is `dto/response/BookPageResponse.java`
- `GET /books/{id}` was added so the book detail page no longer fetches the full book list
- Security config now allows public `GET /books` and `GET /books/{id}`

## Frontend Search UX
- Book list page now calls backend search API instead of loading all books and filtering locally
- Book list state is URL-driven through query string parameters:
  - `/books?q=...`
  - `/books?category=...`
  - `/books?sort=...`
  - `/books?page=...`
- Book list includes:
  - debounced search input
  - category filter
  - sort selector
  - pagination UI
- Navbar now has a global search box
- Submitting search from navbar navigates to:
  - `/books?q=...`
- Refresh/back-forward should preserve search/filter state because it is stored in the URL

## Home Page Status
- Home page no longer uses local mock book data
- `Frontend/bookstore-ui/src/data/books.js` was removed
- Home page now fetches real data from backend:
  - `GET /books?size=12&sort=rating`
- Home page currently shows:
  - featured books from backend data
  - recommended books based on `viewedCategories` history
- Hero CTA now uses React Router `Link` to `/books`

## Frontend Text Encoding
- Major mojibake / broken Vietnamese UI strings were corrected to proper Vietnamese with diacritics
- Fixed pages/components include:
  - `src/App.js`
  - `src/pages/Home.js`
  - `src/pages/BookList.js`
  - `src/pages/BookDetail.js`
- `HistoryContext.js` was also cleaned up to remove an unused `useEffect` import

## Image Handling

### Current Preferred Approach
- Preferred approach is now Cloudinary, not local static uploads
- Backend now has a Cloudinary upload integration
- Upload endpoint:
  - `POST /books/upload-image`
- Upload response returns:
  - `url`
  - `publicId`
  - `originalFilename`
- Expected flow:
  1. Upload image to `/books/upload-image`
  2. Take `result.url`
  3. Save that URL into `Book.image` when creating/updating a book

### Cloudinary Environment Variables
- Add to backend `.env` for real usage:

```text
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_FOLDER=bookstore
```

### Frontend Image Logic
- If `book.image` is a full URL:
  - frontend renders it directly
- If `book.image` is not a full URL:
  - frontend uses the stored value as-is
- Placeholder image exists at:
  - `Frontend/bookstore-ui/public/placeholder-book.svg`
- There is no longer a frontend fallback to:
  - `/uploads/...`

### Default Avatar Logic
- Frontend now has a shared default avatar asset:
  - `Frontend/bookstore-ui/public/default-avatar.svg`
- Navbar account badge uses the default avatar when:
  - `user.avatar` is empty
  - avatar image fails to load
- Account page uses the default avatar when:
  - `profile.avatar` and `user.avatar` are both missing
  - avatar image fails to load

## Important Config Mismatch
- Root `README.md` still contains older instructions that do not fully match current code
- Old README references:
  - port `8181`
  - context path `/identity`
- Current runtime is:
  - port `8080`
  - routes like `/auth`, `/users`, `/books`, `/cart`

## Practical Testing Flow
1. Start MySQL with `docker compose up -d mysql`
2. Start backend on `8080`
3. Start frontend on `3000`
4. Register account with `POST /auth/register`
5. Login with `POST /auth/token`
6. Test `GET /users/my-info`
7. Update profile with `PUT /users/me`
8. Test global/navbar search to confirm it redirects to `/books?q=...`
9. Test `GET /books` with query params for search/filter/sort/pagination
10. Test `GET /books/{id}` from the book detail page
11. Upload book image with `POST /books/upload-image`
12. Create book with `POST /books` using the uploaded image URL
13. Test cart flow

## Notes About Recent Debugging
- Frontend account page previously treated failed profile updates as success because it did not check `res.ok`
- Account page was updated to handle backend errors properly
- Backend user profile issue was traced to backend behavior, not just frontend
- Frontend avatar display was updated to avoid external placeholder services
- Frontend book search was moved from client-side filtering to backend search API
- Book detail page was changed to fetch `GET /books/{id}` directly
- Home page was switched from mock data to backend data
- Frontend Vietnamese text rendering issues were fixed in the main user-facing pages
- Backend was rebuilt clean with:

```powershell
./mvnw.cmd clean -DskipTests package
```

- Verified more recently:

```powershell
./mvnw.cmd -q -DskipTests compile
npm run build
```

## If Resuming Later
- Ask Codex:

```text
Đọc file SESSION_NOTES.md trong web-project rồi tiếp tục hỗ trợ project này.
```
