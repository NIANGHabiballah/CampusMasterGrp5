<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Course extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'description',
        'teacher_id',
        'semester',
        'credits',
        'cover_image_url',
        'status',
        'max_students',
    ];

    protected $casts = [
        'credits' => 'integer',
        'max_students' => 'integer',
    ];

    // Relationships
    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function students()
    {
        return $this->belongsToMany(User::class, 'course_enrollments', 'course_id', 'student_id')
                    ->withPivot('enrolled_at', 'status')
                    ->withTimestamps();
    }

    public function enrollments()
    {
        return $this->hasMany(CourseEnrollment::class);
    }

    public function assignments()
    {
        return $this->hasMany(Assignment::class);
    }

    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'ACTIVE');
    }

    public function scopeBySemester($query, $semester)
    {
        return $query->where('semester', $semester);
    }

    public function scopeByTeacher($query, $teacherId)
    {
        return $query->where('teacher_id', $teacherId);
    }

    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('title', 'like', "%{$search}%")
              ->orWhere('description', 'like', "%{$search}%");
        });
    }

    // Accessors
    public function getEnrolledStudentsCountAttribute()
    {
        return $this->students()->count();
    }

    public function getAvailableSpotsAttribute()
    {
        return $this->max_students - $this->enrolled_students_count;
    }

    // Methods
    public function isActive()
    {
        return $this->status === 'ACTIVE';
    }

    public function isFull()
    {
        return $this->enrolled_students_count >= $this->max_students;
    }

    public function canEnroll()
    {
        return $this->isActive() && !$this->isFull();
    }
}