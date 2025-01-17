# Nibblix Folder Structure Documentation

## Client Structure
```
client/
├── src/
│   ├── app/                    # Next.js app directory for routing
│   │   ├── (admin)/           # Admin dashboard routes (grouped)
│   │   ├── (auth)/            # Authentication routes (grouped)
│   │   ├── (restaurant)/      # Restaurant-specific routes (grouped)
│   │   ├── error/             # Error handling pages
│   │   └── loading/           # Loading states
│   ├── components/            # React components
│   │   ├── auth/              # Authentication related components
│   │   ├── common/            # Shared components across features
│   │   ├── dashboard/         # Admin dashboard components
│   │   ├── forms/             # Form components and elements
│   │   ├── layout/            # Layout components (headers, footers)
│   │   ├── menu/              # Menu management components
│   │   ├── orders/            # Order management components
│   │   ├── restaurant/        # Restaurant-specific components
│   │   ├── tables/            # Table management components
│   │   └── ui/                # UI components (buttons, inputs)
│   ├── hooks/                 # Custom React hooks
│   │   ├── api/               # API related hooks
│   │   ├── auth/              # Authentication hooks
│   │   ├── form/              # Form handling hooks
│   │   ├── restaurant/        # Restaurant-specific hooks
│   │   └── store/             # State management hooks
│   ├── lib/                   # Third-party library configurations
│   ├── services/              # Service layer
│   │   ├── api/               # API client configurations
│   │   ├── auth/              # Authentication services
│   │   ├── restaurant/        # Restaurant services
│   │   └── storage/           # Local storage services
│   ├── store/                 # State management
│   │   ├── slices/            # Redux slices
│   │   └── middleware/        # Redux middleware
│   ├── styles/                # Global styles and theme
│   ├── types/                 # TypeScript type definitions
│   └── utils/                 # Utility functions
└── public/                    # Static files
```

## Server Structure
```
server/
├── src/
│   ├── config/               # Configuration files
│   ├── constants/            # Constant values and enums
│   ├── controllers/          # Route controllers
│   ├── decorators/          # Custom decorators
│   ├── dto/                 # Data Transfer Objects
│   ├── entities/            # Database entities
│   ├── events/              # Event handlers
│   ├── filters/             # Exception filters
│   ├── guards/              # Authorization guards
│   ├── interfaces/          # TypeScript interfaces
│   ├── middlewares/         # Custom middleware
│   ├── modules/             # Feature modules
│   │   ├── auth/            # Authentication module
│   │   ├── restaurant/      # Restaurant management
│   │   ├── order/           # Order management
│   │   ├── inventory/       # Inventory management
│   │   ├── user/            # User management
│   │   ├── table/           # Table management
│   │   ├── analytics/       # Analytics and reporting
│   │   └── notification/    # Notification system
│   ├── repositories/        # Database repositories
│   ├── services/            # Business logic services
│   ├── types/               # Type definitions
│   └── utils/               # Utility functions
└── test/                    # Test files
```

## Shared Structure
```
shared/
├── src/
│   ├── types/               # Shared TypeScript types
│   │   ├── auth/            # Authentication types
│   │   ├── restaurant/      # Restaurant types
│   │   ├── order/           # Order types
│   │   ├── inventory/       # Inventory types
│   │   └── user/            # User types
│   ├── constants/           # Shared constants
│   │   ├── permissions/     # Permission definitions
│   │   ├── settings/        # Default settings
│   │   └── validation/      # Validation rules
│   ├── utils/               # Shared utilities
│   │   ├── formatting/      # Data formatting
│   │   ├── validation/      # Validation helpers
│   │   └── security/        # Security utilities
│   ├── config/             # Shared configurations
│   ├── interfaces/         # Shared interfaces
│   └── validators/         # Shared validators
└── tests/                  # Test files
```

## Key Concepts

### Client-Side Organization
- Group by feature first, then by type
- Keep components small and focused
- Use barrel exports (index.ts) for clean imports
- Lazy load routes and heavy components

### Server-Side Organization
- Follow NestJS modular architecture
- Keep business logic in services
- Use DTOs for data validation
- Implement repository pattern

### Shared Code Organization
- Keep only truly shared code
- Use strict TypeScript
- Maintain backwards compatibility
- Document all public APIs

## Best Practices

1. **File Naming**
   - Use kebab-case for files: `order-service.ts`
   - Use PascalCase for components: `OrderList.tsx`
   - Use camelCase for utilities: `formatDate.ts`

2. **Module Organization**
   - Group related features
   - Keep dependencies explicit
   - Use index files for exports
   - Document public APIs

3. **Testing**
   - Keep tests close to source code
   - Follow naming convention: `*.test.ts` or `*.spec.ts`
   - Separate unit, integration, and e2e tests

4. **Documentation**
   - Document all public APIs
   - Keep README files updated
   - Use JSDoc for complex functions
   - Maintain API documentation
