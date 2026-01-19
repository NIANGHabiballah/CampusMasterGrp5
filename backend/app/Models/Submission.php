<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Submission extends Model
{
    use HasFactory;

    protected $fillable = [
        'assignment_id',
        'student_id',
        'files',
        'content',
        'submitted_at',
        'status',
        'grade',
        'feedback',
        'graded_by',
        'graded_at',
    ];

    protected $casts = [
        'files' => 'array',
        'submitted_at' => 'datetime',
        'graded_at' => 'datetime',
        'grade' => 'integer',
    ];

    // Relationships
    public function assignment()
    {
        return $this->belongsTo(Assignment::class);
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function grader()
    {
        return $this->belongsTo(User::class, 'graded_by');
    }

    // Scopes
    public function scopeSubmitted($query)
    {
        return $query->where('status', 'SUBMITTED');
    }

    public function scopeGraded($query)
    {
        return $query->where('status', 'GRADED');
    }

    public function scopeLate($query)
    {
        return $query->where('status', 'LATE');
    }

    public function scopeByStudent($query, $studentId)
    {
        return $query->where('student_id', $studentId);
    }

    public function scopeByAssignment($query, $assignmentId)
    {
        return $query->where('assignment_id', $assignmentId);
    }

    public function scopePendingGrading($query)
    {
        return $query->whereIn('status', ['SUBMITTED', 'LATE'])
                    ->whereNull('grade');
    }

    // Accessors
    public function getIsLateAttribute()
    {
        return $this->submitted_at > $this->assignment->due_date;
    }

    public function getIsGradedAttribute()
    {
        return $this->status === 'GRADED' && !is_null($this->grade);
    }

    public function getGradePercentageAttribute()
    {
        if (!$this->is_graded) {
            return null;
        }

        return round(($this->grade / $this->assignment->max_points) * 100, 2);
    }

    public function getGradeLetterAttribute()
    {
        if (!$this->is_graded) {
            return null;
        }

        $percentage = $this->grade_percentage;
        
        if ($percentage >= 90) return 'A';
        if ($percentage >= 80) return 'B';
        if ($percentage >= 70) return 'C';
        if ($percentage >= 60) return 'D';
        return 'F';
    }

    // Methods
    public function isSubmitted()
    {
        return $this->status === 'SUBMITTED';
    }

    public function isGraded()
    {
        return $this->status === 'GRADED';
    }

    public function isLate()
    {
        return $this->status === 'LATE';
    }

    public function grade($grade, $feedback = null, $graderId = null)
    {
        $this->update([
            'grade' => $grade,
            'feedback' => $feedback,
            'graded_by' => $graderId,
            'graded_at' => now(),
            'status' => 'GRADED',
        ]);

        return $this;
    }
}