# Prescription Templates Stepper

This component implements a multi-step wizard for creating and managing prescription templates using React Router DOM and Framer Motion animations.

## Features

- **5-Step Process**: Page Setup → Patient Section → Body Section → Header Section → Footer Section
- **Route-based Navigation**: Each step has its own URL for bookmarking and direct access
- **Smooth Animations**: Framer Motion powered transitions between steps
- **Step Indicators**: Visual progress indicator with clickable steps
- **Responsive Design**: Works on all device sizes

## Routes

- `/dashboard/pre-management/prescription-templates/page-setup`
- `/dashboard/pre-management/prescription-templates/patient-section`
- `/dashboard/pre-management/prescription-templates/body-section`
- `/dashboard/pre-management/prescription-templates/header-section`
- `/dashboard/pre-management/prescription-templates/footer-section`

## Components

### Stepper Component (`/src/components/shared/Stepper.tsx`)

- Main stepper wrapper with animation logic
- Supports custom step titles and navigation callbacks
- Green brand color theme

### Step Components (`/src/pages/PrescriptionManagement/PrescriptionTemplates/steps/`)

- `PageSetup.tsx` - Step 1: Configure page layout settings
- `PatientSection.tsx` - Step 2: Set up patient information display
- `BodySection.tsx` - Step 3: Configure main prescription content
- `HeaderSection.tsx` - Step 4: Customize header information
- `FooterSection.tsx` - Step 5: Configure footer elements

## Usage

The stepper automatically syncs with the current route and allows navigation through:

- Next/Back buttons
- Clicking on step indicators
- Direct URL navigation
- Browser back/forward buttons

## Customization

To modify the stepper:

1. Update step titles in the `stepTitles` array
2. Add/modify routes in the `stepRoutes` array
3. Create corresponding step components
4. Update the router configuration with new routes

## Styling

The component uses Tailwind CSS with a green brand color scheme (`bg-green-500`, `hover:bg-green-600`, etc.) matching your application's design system.
