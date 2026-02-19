# 📥 📤 Data Import & Export Guide

## 🎯 Purpose

Export your exam data as JSON files, import data from other systems, and sync all data to the cloud (Firebase).

---

## 📤 Exporting Data

### Exporting Exam Data

1. Go to **Reports and Data Management** section
2. Click **💾 Download Exam Data** button
3. JSON file will automatically download (e.g., `exam-data-2025-02-19.json`)

### Exporting Goals

1. Go to **Reports and Data Management** section
2. Click **🎯 Download Goals** button
3. Goals JSON file will automatically download

### Exported File Format

```json
[
  {
    "id": 1234567890,
    "gradeLevel": "High School Prep",
    "studentName": "John Doe",
    "examName": "Practice Exam 1",
    "date": "2025-02-19",
    "notes": "Good performance",
    "subjects": [
      {
        "lesson": "Mathematics",
        "topic": "Equations",
        "correct": 25,
        "wrong": 3,
        "empty": 2,
        "total": 30
      }
    ],
    "uploadedBy": "uid123",
    "uploadedByNickname": "John Teacher",
    "uploadedAt": "2025-02-19T10:30:00Z"
  }
]
```

---

## 📥 Importing Data

### Preparation

1. **Make sure you're logged in** 🔐
   - You should see a green status indicator in the top right
   - Your nickname should be displayed

2. **Prepare your JSON file**
   - Use an exported file, or
   - Create your own JSON file (following the format below)

### Importing Exam Data

1. Go to **Reports and Data Management** section
2. Click **📁 Upload Exam Data** button
3. Select your JSON file
4. System automatically:
   - ✅ Validates data (skips records with missing info)
   - ✅ Checks for duplicates (same exam won't upload twice)
   - ✅ Adds metadata (who uploaded it)
   - ✅ Saves to localStorage (local backup)
   - ☁️ Uploads to Firebase (cloud sync)
   - 🔄 Updates charts and reports

### Importing Goals

1. Go to **Reports and Data Management** section
2. Click **🎯 Upload Goals** button
3. Select your JSON file
4. Goals automatically sync to cloud

---

## 📋 JSON File Examples

### Single Exam (Simple Format)

```json
{
  "studentName": "Ahmed Smith",
  "examName": "Practice Test 2",
  "date": "2025-02-20",
  "gradeLevel": "High School Prep",
  "notes": "Good performance in Math",
  "subjects": [
    {
      "lesson": "Mathematics",
      "topic": "Trigonometry",
      "total": 25,
      "correct": 20,
      "wrong": 3,
      "empty": 2
    },
    {
      "lesson": "Physics",
      "topic": "Electricity",
      "total": 20,
      "correct": 17,
      "wrong": 2,
      "empty": 1
    }
  ]
}
```

### Multiple Exams (Batch Format)

```json
[
  {
    "studentName": "Alice Johnson",
    "examName": "Practice Exam 1",
    "date": "2025-02-15",
    "gradeLevel": "High School Prep",
    "subjects": [
      {
        "lesson": "Turkish",
        "topic": "Literature",
        "total": 25,
        "correct": 22,
        "wrong": 2,
        "empty": 1
      }
    ]
  },
  {
    "studentName": "Bob Smith",
    "examName": "Practice Exam 1",
    "date": "2025-02-15",
    "gradeLevel": "High School Prep",
    "subjects": [
      {
        "lesson": "Mathematics",
        "topic": "Algebra",
        "total": 30,
        "correct": 24,
        "wrong": 4,
        "empty": 2
      }
    ]
  }
]
```

### Goals Format

```json
{
  "Alice Johnson": {
    "Mathematics": 85,
    "Turkish": 90,
    "Science": 80
  },
  "Bob Smith": {
    "Mathematics": 75,
    "English": 88
  }
}
```

---

## ✅ Valid Information

### Required Fields
- `studentName` - Student name (required)
- `examName` - Exam name (required)
- `date` - Date in YYYY-MM-DD format (required)
- `gradeLevel` - Grade/level (required)
- `subjects` - At least 1 subject (required)

### Subject Fields
- `lesson` - Subject name (required)
- `topic` - Topic name (required)
- `total` - Total questions (required)
- `correct` - Correct answers (default: 0)
- `wrong` - Wrong answers (default: 0)
- `empty` - Blank answers (auto-calculated: total - correct - wrong)

### Optional Fields
- `notes` - Exam notes
- `uploadedBy` - Uploader's UID (auto-added)
- `uploadedByNickname` - Uploader's name (auto-added)
- `uploadedAt` - Upload date (auto-added)

---

## ⚠️ Important Notes

### Duplicate Prevention
- Same student, exam name, and date combination won't upload twice
- You'll get a warning if duplicates are detected

### Error Handling
- Invalid records are automatically skipped
- Console (F12) provides detailed information
- Clear error messages for format issues

### Offline Support
- Data always saves to localStorage (stored on your device)
- Data won't go to cloud until internet connection
- Use ☁️ Upload to Cloud button to sync manually

### Firebase Sync
- Import automatically uploads to Firebase (if logged in)
- All changes sync in real-time
- Auto-updates on other devices

---

## 🔄 Workflow Example

### Scenario: Migrate Data from Another System

```
1. Export exam data as .json from another system
   ↓
2. Open this website and log in
   ↓
3. Click "📁 Upload Exam Data" button
   ↓
4. Select the JSON file
   ↓
5. System automatically:
   - Validates data
   - Checks for duplicates
   - Uploads to Firebase
   ↓
6. Charts and reports update automatically
   ↓
7. View data on any device
```

---

## 💡 Tips

### Best Practices

1. **Regular Backups**
   - Export data weekly
   - Keep backups on your computer

2. **Batch Import**
   - Import multiple records at once
   - System automatically filters duplicates

3. **Format Validation**
   - Use online JSON validator for large files
   - Check that all required fields are present

4. **Verification**
   - After import, check charts and reports
   - Fix any erroneous records manually

---

## 🆘 Troubleshooting

### Issue: "Invalid file format" error

**Solution:**
- Validate JSON file (use online JSON validator)
- Check required fields (studentName, examName, date, gradeLevel)
- Each student needs at least 1 subject

### Issue: Data uploaded but no confirmation

**Solution:**
- Make sure you're logged in
- Open Console (F12) and check error messages
- Check for duplicate records (warning message may appear)

### Issue: Data not synced to cloud (Firebase)

**Solution:**
- Check internet connection
- Verify you're logged in
- Check that data is in localStorage
- Click "☁️ Upload to Cloud" button manually

---

## 📞 Support

For questions:
- Open Console (F12 → Console tab)
- Check error messages
- Follow examples in this guide

---

<div align="center">
  <sub>Your data is always safe with our import/export system</sub>
</div>
