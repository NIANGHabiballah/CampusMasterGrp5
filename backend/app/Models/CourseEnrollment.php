<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CourseEnrollment extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'student_id',
        'enrolled_at',
        'status',
    ];

    protected $casts = [
        'enrolled_at' => 'datetime',
    ];

    // Relationships
    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    // Scopes
    public function scopeEnrolled($query)
    {
        return $query->where('status', 'ENROLLED');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'COMPLETED');
    }

    public function scopeDropped($query)
    {
        return $query->where('status', 'DROPPED');
    }

    public function scopeByCourse($query, $courseId)
    {
        return $query->where('course_id', $courseId);
    }

    public function scopeByStudent($query, $studentId)
    {
        return $query->where('student_id', $studentId);
    }

    // Methods
    public function complete()
    {
        $this->update(['status' => 'COMPLETED']);
        return $this;
    }

    public function drop()
    {
        $this->update(['status' => 'DROPPED']);
        return $this;
    }

    public function isEnrolled()
    {
        return $this->status === 'ENROLLED';
    }

    public function isCompleted()
    {
        return $this->status === 'COMPLETED';
    }

    public function isDropped()
    {
        return $this->status === 'DROPPED';
    }
}