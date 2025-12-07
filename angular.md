> zoneless và zone.js

> @Component
- Là decorator lớp (class decorator) do Angular cung cấp, dùng để đánh dấu một class là một component và gắn metadata cấu hình cho component đó. 
- Metadata trong angular là 1 object, cụ thể là Khi bạn viết @Component({...}) thì object {...} chính là metadata
- Trong quá trình biên dịch / runtime, Angular sẽ đọc metadata để:
  - hiểu class đó là component
  - tạo instance component
  - liên kết template, styles
  - thiết lập dependency injection (providers) nếu có

> changeDetection
- nhận 2 giá trị là: ChangeDetectionStrategy.OnPush và ChangeDetectionStrategy.Default (mặc định)
- OnPush: 1 component được đánh dấu OnPush sẽ chỉ được “check lại” (bật change detection) trong các trường hợp sau:
  - @Input thay đổi (thay đổi reference)
  - Event từ component hoặc con của nó
  - Observable / async pipe phát giá trị mới
- Default: Angular sẽ kiểm tra (check) mọi component trong cây component mỗi khi có change detection xảy ra (do sự kiện, async operation, timer,…)

> standalone
- kiểu boolean, liên quan đến việc import export 1 comp
- true: là Component standalone, thì không cần được khai báo trong NgModule, có thể import trực tiếp vào comp khác thông qua imports: [PrroductItemComponent] của @Component
- false: là Component thông thường, phải đc khai báo trong 1 @NgModule thì mới có thể import ở các comp khác

> cơ chế TypeScript “parameter property”
- Trong TypeScript, khi bạn khai báo private, public, hoặc protected trực tiếp trong constructor parameter, nó tự động tạo thuộc tính của class và gán giá trị truyền vào constructor cho thuộc tính đó.
  - Thay vì: 
  ```
  class LoginComponent {
    constructor(private fb: FormBuilder) {}
  }
  ```
  - Ta có thể viết như sau:
  ```
  class LoginComponent {
    private fb: FormBuilder; // 1️⃣ Khai báo property

    constructor(fb: FormBuilder) { // 2️⃣ Nhận param
      this.fb = fb;                // 3️⃣ Gán giá trị
    }
  }
  ```
  - Và có thể dùng inject() thay vì constructor như trên
  ```
  class LoginComponent {
    fb = inject(FormBuilder);
    authService = inject(AuthService);
    router = inject(Router);
    matSnackBar = inject(MatSnackBar);

    ...
  }
  ```

> Dependency Injection (DI) trong Angular
- Khi component được khởi tạo, Angular:

  - Đọc danh sách tham số trong constructor.

  - Biết cần inject những service nào (qua kiểu dữ liệu — như FormBuilder, Router, AuthService, …).

  - Tự động tìm instance phù hợp trong DI container.

  - Gọi constructor và gán chúng vào thuộc tính tương ứng.

> Cách tạo 1 folder comp đủ 4 file
- Khi đứng ở root (có file angular.json) và có root/src/app/pages
```
ng g c pages/signin
```

> Promise và Observable
- Promise 
  - đại diện cho 1 giá trị trong future hay nói cách khác là dù dùng resolve() nhiều lần trong constructor func Promise thì then nó cx chỉ lấy 1
  - đc thực thi ngay lập tức sau khi khởi tạo => eager
- Observable 
  - một “luồng” (stream) dữ liệu có thể phát nhiều giá trị theo thời gian (0, 1 hoặc nhiều giá trị) đến các subscriber
  - đc thực thi khi gọi subcribe => lazy

> fetch() và HttpClient của Angular
- Có thể dùng đc fetch trong 1 dự án của angular nhưng khuyến khích dùng HttpClient hơn vì có tích hợp RxJS
- fetch return Promise , còn HttpClient return Observable

> SSR trong angular
- Không giống với nextJS là có 2 loại comp là server và client comp
- Khi dùng SSR thì các func đc gọi trong angular sẽ chạy 2 lần , 1 lần ở ssr và 1 lần csr
- do đó sẽ có 1 biến là isPlatformBrowser của angular/common để check , nếu ở csr thì có thể dùng localstorage, ...

> Guard
- Cho phép bạn kiểm soát quyền truy cập vào các route (đường dẫn)
- Có nhiều lại guard: CanActive, CanActiveChild, CanDeactive

> [label]="(isLoading$ | async) ? 'Đang đăng nhập...' : 'Đăng nhập'"
- là Property Binding
- gán giá trị động (biểu thức) cho thuộc tính label
- | async là Async Pipe, thứ giúp bạn auto subcribe thằng isLoading$ Observable và lấy ra giá trị mới nhất để hiển thị trong template. Bên cạnh đó tự unsubcribe khi component destroy

> pipe()
- cho phép you combine nhiều operator (như map, filter, switchMap ...) lại vs nhau để biến đổi data stream của Observable
```
observable.pipe(
  operator1(),
  operator2(),
  ...
)
```

> switchMap()
- khác mới map là callback của map return 1 value(string, obj,...), còn callback của switchMap return về 1 Observable mới
- Nếu giả sử api đc call nhiều lần (vd: nhấn nhiều lần nút login) tương đương với việc có nhiều Observable vì mỗi Observable đại diện cho 1 request của HttpClient => lúc này cancel các request trước đó và chỉ lấy request mới nhất
- Ví dụ, khi gọi api lồng nhau
```
this.userService.getUser().pipe(
  switchMap(user => this.postService.getPostsByUser(user.id))
)
.subscribe(posts => console.log('Posts:', posts));

```

> of()
- đc dùng để tạo 1 Observable với các value tĩnh (obj,number, string)

> tap()
- đc dùng khi muốn thực hiện side effect (loading, navigate, ...) , hay cần xem hoặc ghi log hoặc muốn log xem các value
- nó ko biến đổi các dữ liệu của Observable còn map() thì có làm thay đổi