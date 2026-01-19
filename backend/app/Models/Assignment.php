<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Assignment extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'description',
        'course_id',
        'due_date',
        'max_points',
        'status',
        'attachments',
        'allow_late_submission',
        'late_penalty_percent',
    ];

    protected $casts = [
        'due_date' => 'datetime',
        'max_points' => 'integer',
        'attachments' => 'array',
        'allow_late_submission' => 'boolean',
        'late_penalty_percent' => 'integer',
    ];

    // Relationships
    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function submissions()
    {
        return $this->hasMany(Submission::class);
    }

    // Scopes
    public function scopePublished($query)
    {
        return $query->where('status', 'PUBLISHED');
    }

    public function scopeDraft($query)
    {
        return $query->where('status', 'DRAFT');
    }

    public function scopeClosed($query)
    {
        return $query->where('status', 'CLOSED');
    }

    public function scopeByCourse($query, $courseId)
    {
        return $query->where('course_id', $courseId);
    }

    public function scopeByTeacher($query, $teacherId)
    {
        return $query->whereHas('course', function ($q) use ($teacherId) {
            $q->where('teacher_id', $teacherId);
        });
    }

    public function scopeDueSoon($query, $days = 7)
    {
        return $query->where('due_date', '<=', now()->addDays($days))
                    ->where('due_date', '>=', now());
    }

    public function scopeOverdue($query)
    {
        return $query->where('due_date', '<', now())
                    ->where('status', 'PUBLISHED');
    }

    // Accessors
    public function getSubmissionsCountAttribute()
    {
        return $this->submissions()->count();
    }

    public function getGradedSubmissionsCountAttribute()
    {
        return $this->submissions()->whereNotNull('grade')->count();
    }

    public function getIsOverdueAttribute()
    {
        return $this->due_date < now() && $this->status === 'PUBLISHED';
    }

    public function getTimeRemainingAttribute()
    {
        if ($this->is_overdue) {
            return null;
        }
        
        return $this->due_date->diffForHumans();
    }

    // Methods
    public function isPublished()
    {
        return $this->status === 'PUBLISHED';
    }

    public function isDraft()
    {
        return $this->status === 'DRAFT';
    }

    public function isClosed()
    {
        return $this->status === 'CLOSED';
    }

    public function canSubmit()
    {
        if (!$this->isPublished()) {
            return false;
        }

        if ($this->is_overdue && !$this->allow_late_submission) {
            return false;
        }

        return true;
    }

    public function getSubmissionForStudent($studentId)
    {
        return $this->submissions()->where('student_id', $studentId)->first();
    }
}