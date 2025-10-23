package com.edunex.edunex_lms.service;

import com.edunex.edunex_lms.entity.*;
import com.edunex.edunex_lms.repository.*;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReportService {
    
    private final EnrollmentRepository enrollmentRepository;
    private final AssignmentRepository assignmentRepository;
    private final AttendanceRepository attendanceRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    
    public byte[] generateGradeReportPDF(Long studentId, Long courseId) {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, baos);
            
            document.open();
            
            // Title
            com.itextpdf.text.Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Paragraph title = new Paragraph("Grade Report", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);
            
            // Student and Course Info
            java.util.Optional<Enrollment> enrollmentOpt = enrollmentRepository.findByStudentIdAndCourseId(studentId, courseId);
            if (enrollmentOpt.isPresent()) {
                Enrollment enrollment = enrollmentOpt.get();
                
                com.itextpdf.text.Font infoFont = FontFactory.getFont(FontFactory.HELVETICA, 12);
                document.add(new Paragraph("Student: " + enrollment.getStudent().getFullName(), infoFont));
                document.add(new Paragraph("Course: " + enrollment.getCourse().getCourseName(), infoFont));
                document.add(new Paragraph("Instructor: " + enrollment.getCourse().getInstructor().getFullName(), infoFont));
                document.add(new Paragraph("Progress: " + enrollment.getProgressPercentage() + "%", infoFont));
                document.add(new Paragraph("Final Grade: " + (enrollment.getFinalGrade() != null ? enrollment.getFinalGrade() : "Not Graded"), infoFont));
                document.add(new Paragraph("\n"));
            }
            
            // Assignments Table
            document.add(new Paragraph("Assignments", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14)));
            document.add(new Paragraph("\n"));
            
            PdfPTable assignmentTable = new PdfPTable(4);
            assignmentTable.setWidthPercentage(100);
            assignmentTable.setWidths(new float[]{3, 2, 2, 2});
            
            addTableHeader(assignmentTable, new String[]{"Title", "Due Date", "Status", "Marks"});
            
            List<Assignment> assignments = assignmentRepository.findByCourseIdAndStudentId(courseId, studentId);
            for (Assignment assignment : assignments) {
                assignmentTable.addCell(assignment.getTitle());
                assignmentTable.addCell(assignment.getDueDate().format(DATE_FORMATTER));
                assignmentTable.addCell(assignment.getStatus().toString());
                assignmentTable.addCell(assignment.getMarksObtained() != null ? 
                    assignment.getMarksObtained() + "/" + assignment.getMaxMarks() : "N/A");
            }
            
            document.add(assignmentTable);
            document.add(new Paragraph("\n"));
            
            // Quiz Attempts Table
            document.add(new Paragraph("Quiz Attempts", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14)));
            document.add(new Paragraph("\n"));
            
            PdfPTable quizTable = new PdfPTable(4);
            quizTable.setWidthPercentage(100);
            quizTable.setWidths(new float[]{3, 2, 2, 2});
            
            addTableHeader(quizTable, new String[]{"Quiz", "Date", "Score", "Percentage"});
            
            List<QuizAttempt> attempts = quizAttemptRepository.findByStudentId(studentId);
            for (QuizAttempt attempt : attempts) {
                if (attempt.getQuiz().getCourse().getId().equals(courseId)) {
                    quizTable.addCell(attempt.getQuiz().getTitle());
                    quizTable.addCell(attempt.getStartedAt().format(DATE_FORMATTER));
                    quizTable.addCell(attempt.getMarksObtained() + "/" + attempt.getTotalMarks());
                    quizTable.addCell(String.format("%.2f%%", attempt.getPercentage()));
                }
            }
            
            document.add(quizTable);
            
            document.close();
            
            log.info("Generated grade report PDF for student {} in course {}", studentId, courseId);
            return baos.toByteArray();
            
        } catch (Exception e) {
            log.error("Error generating grade report PDF", e);
            throw new RuntimeException("Failed to generate grade report", e);
        }
    }
    
    public byte[] generateAttendanceReportExcel(Long studentId, Long courseId) {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Attendance Report");
            
            // Create header row
            Row headerRow = sheet.createRow(0);
            CellStyle headerStyle = workbook.createCellStyle();
            org.apache.poi.ss.usermodel.Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);
            
            String[] headers = {"Date", "Status", "Remarks"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }
            
            // Fill data
            List<Attendance> attendances = attendanceRepository.findByStudentIdAndCourseId(studentId, courseId);
            int rowNum = 1;
            
            for (Attendance attendance : attendances) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(attendance.getAttendanceDate().format(DATE_FORMATTER));
                row.createCell(1).setCellValue(attendance.getStatus().toString());
                row.createCell(2).setCellValue(attendance.getRemarks() != null ? attendance.getRemarks() : "");
            }
            
            // Auto-size columns
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }
            
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            workbook.write(baos);
            
            log.info("Generated attendance report Excel for student {} in course {}", studentId, courseId);
            return baos.toByteArray();
            
        } catch (Exception e) {
            log.error("Error generating attendance report Excel", e);
            throw new RuntimeException("Failed to generate attendance report", e);
        }
    }
    
    public byte[] generatePerformanceReportPDF(Long courseId) {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            Document document = new Document(PageSize.A4, 50, 50, 50, 50);
            PdfWriter.getInstance(document, baos);
            
            document.open();
            
            // Title
            com.itextpdf.text.Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Paragraph title = new Paragraph("Course Performance Report", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);
            
            // Enrollment Statistics
            document.add(new Paragraph("Enrollment Statistics", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14)));
            document.add(new Paragraph("\n"));
            
            PdfPTable enrollmentTable = new PdfPTable(5);
            enrollmentTable.setWidthPercentage(100);
            
            addTableHeader(enrollmentTable, new String[]{"Student", "Progress", "Final Grade", "Status", "Enrolled Date"});
            
            List<Enrollment> enrollments = enrollmentRepository.findByCourseId(courseId);
            for (Enrollment enrollment : enrollments) {
                enrollmentTable.addCell(enrollment.getStudent().getFullName());
                enrollmentTable.addCell(enrollment.getProgressPercentage() + "%");
                enrollmentTable.addCell(enrollment.getFinalGrade() != null ? enrollment.getFinalGrade().toString() : "N/A");
                enrollmentTable.addCell(enrollment.getStatus().toString());
                enrollmentTable.addCell(enrollment.getEnrolledAt().format(DATE_FORMATTER));
            }
            
            document.add(enrollmentTable);
            
            // Statistics Summary
            document.add(new Paragraph("\n"));
            document.add(new Paragraph("Summary", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14)));
            document.add(new Paragraph("Total Students: " + enrollments.size()));
            
            long activeStudents = enrollments.stream()
                .filter(e -> e.getStatus() == Enrollment.EnrollmentStatus.ACTIVE)
                .count();
            document.add(new Paragraph("Active Students: " + activeStudents));
            
            double avgProgress = enrollments.stream()
                .mapToDouble(Enrollment::getProgressPercentage)
                .average()
                .orElse(0.0);
            document.add(new Paragraph(String.format("Average Progress: %.2f%%", avgProgress)));
            
            document.close();
            
            log.info("Generated performance report PDF for course {}", courseId);
            return baos.toByteArray();
            
        } catch (Exception e) {
            log.error("Error generating performance report PDF", e);
            throw new RuntimeException("Failed to generate performance report", e);
        }
    }
    
    private void addTableHeader(PdfPTable table, String[] headers) {
        com.itextpdf.text.Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10);
        for (String header : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(header, headerFont));
            cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setPadding(5);
            table.addCell(cell);
        }
    }
}
