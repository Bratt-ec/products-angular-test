# Test Dev Sofka - Angular Project

This project is a technical test developed in Angular, focusing on product management with features like listing, adding, editing, and deleting products. It adheres to Clean Architecture principles and includes comprehensive unit tests.

## 🚀 Features

- **Product Management**: CRUD operations for products.
- **Form Validation**: robust validation logic for product inputs.
- **Internationalization (i18n)**: Language switching support (en/es).
- **Clean Architecture**: Separation of concerns into `api`, `core`, `infrastructure`, `modules`, and `shared` layers.
- **Unit Testing**: ~70% code coverage using Jasmine & Karma.

## 📂 Project Structure

The project is organized into the following structure:

```
src/app/
├── api/             # Base API services and models (Generic HTTP handling)
├── core/            # Core services (Global, Lang, Form) and utilities
├── infrastructure/  # Specific data services (ProductService) and DTOs
├── modules/         # Feature modules (AddProduct, ListProducts)
├── shared/          # Shared components (Toast, Datatable, ConfirmDialog, etc.) & pipes
└── app.component.*  # Root component
```

## 🛠️ Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/Bratt-ec/products-angular-test.git
    cd products-angular-test
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

## 💻 Usage

**Development Server**:
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## 🧪 Running Tests

This project includes a comprehensive suite of unit tests.

**Run all tests**:
```bash
ng test
```

**Run tests in headless mode (CI)**:
```bash
ng test --watch=false --browsers=ChromeHeadless
```

### Test Coverage Highlights

- **Services**: `ProductService`, `BaseApiService`, `FormService`, `GlobalService`, `LangService`.
- **Components**: `ListProductsComponent`, `AddProductComponent`, `DatatableComponent`, `ConfirmDialogComponent`.
- **Shared**: `TranslatePipe`.

## 📦 Dependencies

- **Angular**: v19
- **RxJS**: Reactive extensions
- **Date-fns**: Date manipulation
- **Jasmine/Karma**: Testing framework
