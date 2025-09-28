# 🎯 Enhanced Form Builder

A powerful drag-and-drop form builder for the Patient Section with advanced features and smooth animations.

## ✨ Features

### 🎨 Enhanced UI/UX

- **Beautiful Animations**: Smooth transitions using framer-motion
- **Modern Design**: Clean cards with hover effects and shadows
- **Visual Feedback**: Real-time visual feedback during drag operations
- **Responsive Layout**: Grid-based responsive design

### 🔧 Advanced Drag & Drop

- **Flexible Dragging**: Enhanced drag handle with grip icon
- **Visual Indicators**: Drag state with opacity and border changes
- **Smooth Reordering**: Automatic order and row recalculation
- **Collision Detection**: Smart collision detection for precise placement

### 📐 Smart Grid System

- **Dynamic Width Control**: Plus/minus buttons for easy resizing (1-12 grid)
- **Auto Row Wrapping**: Intelligent row calculation based on field widths
- **Real-time Updates**: Instant layout updates when resizing fields
- **Visual Width Display**: Badge showing current width value

### ⚙️ Field Customization

- **Inline Settings**: Settings panel with field-specific options
- **Field Types**: Support for text, email, number, password, textarea, select, checkbox, radio, date
- **Options Management**: Dynamic options for select and radio fields
- **Required Toggle**: Easy required field toggle with visual indicator

### 👁️ Preview Mode

- **Live Preview**: Toggle between edit and preview modes
- **Real Form**: See exactly how users will interact with your form
- **Form Validation**: Visual required field indicators

### 💾 Data Management

- **Redux Integration**: Seamlessly integrated with prescriptionTemplateSlice
- **Export Functionality**: Download form blueprint as JSON
- **Reset Options**: Quick reset to default fields
- **Persistent State**: Form state persists across page refreshes

## 🎮 Default Fields

The form builder comes with these default patient fields:

1. **Patient Name** (Text, 6 cols, Required)
2. **Age** (Number, 3 cols, Required)
3. **Gender** (Select, 3 cols, Required) - Options: Male, Female, Other
4. **Patient ID** (Text, 6 cols, Optional)
5. **Visit Date** (Date, 6 cols, Required)

## 🚀 Usage

```tsx
import { FormBuilder } from "../../../../components/FormBuilder";

const PatientSection: React.FC = () => {
  return (
    <div className="min-h-[400px]">
      <FormBuilder />
    </div>
  );
};
```

## 🎯 Interactions

### Drag & Drop

- **Grab Handle**: Click and drag the grip icon to reorder fields
- **Visual Feedback**: Fields become semi-transparent while dragging
- **Auto Reorder**: Order and row positions update automatically

### Resizing Fields

- **Minus Button** (Red): Decrease field width (minimum: 1)
- **Plus Button** (Green): Increase field width (maximum: 12)
- **Width Badge**: Shows current width value
- **Auto Wrap**: Fields automatically wrap to new rows when needed

### Field Actions

- **Preview Toggle** (Blue): Show/hide live field preview
- **Settings** (Gray): Open field customization panel
- **Delete** (Red): Remove field from form

### Mode Toggle

- **Edit Mode**: Full customization with drag, resize, and settings
- **Preview Mode**: See the actual form as users will interact with it

## 📊 Export Data

The exported JSON includes:

```json
{
  "fields": [
    {
      "id": "1",
      "label": "Patient Name",
      "type": "text",
      "placeholder": "Enter patient name",
      "required": true,
      "order": 0,
      "width": 6,
      "row": 0,
      "defaultValue": ""
    }
  ],
  "metadata": {
    "totalFields": 5,
    "totalRows": 2,
    "createdAt": "2025-09-23T10:30:00.000Z"
  }
}
```

## 🛠️ Technical Details

- **Framework**: React with TypeScript
- **State Management**: Redux Toolkit
- **Drag & Drop**: @dnd-kit/core with sortable functionality
- **Animations**: framer-motion
- **Styling**: TailwindCSS with shadcn/ui components
- **Grid System**: CSS Grid with 12-column layout

## 🎨 Visual Enhancements

- Smooth hover effects on all interactive elements
- Color-coded action buttons (red/green/blue/gray)
- Dynamic shadows and borders
- Animated state transitions
- Loading and drag state indicators

This form builder provides a complete solution for creating dynamic, responsive forms with an excellent user experience!
