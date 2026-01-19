<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
        'role',
        'status',
        'student_id',
        'phone',
        'bio',
        'avatar_url',
        'last_login',
        'email_verified_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'last_login' => 'datetime',
        'password' => 'hashed',
    ];

    // Relationships
    public function teachingCourses()
    {
        return $this->hasMany(Course::class, 'teacher_id');
    }

    public function enrolledCourses()
    {
        return $this->belongsToMany(Course::class, 'course_enrollments', 'student_id', 'course_id')
                    ->withPivot('enrolled_at', 'status')
                    ->withTimestamps();
    }

    public function submissions()
    {
        return $this->hasMany(Submission::class, 'student_id');
    }

    public function sentMessages()
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    public function receivedMessages()
    {
        return $this->hasMany(Message::class, 'receiver_id');
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    // Scopes
    public function scopeStudents($query)
    {
        return $query->where('role', 'STUDENT');
    }

    public function scopeTeachers($query)
    {
        return $query->where('role', 'TEACHER');
    }

    public function scopeAdmins($query)
    {
        return $query->where('role', 'ADMIN');
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'ACTIVE');
    }

    // Accessors
    public function getFullNameAttribute()
    {
        return $this->first_name . ' ' . $this->last_name;
    }

    // Methods
    public function isStudent()
    {
        return $this->role === 'STUDENT';
    }

    public function isTeacher()
    {
        return $this->role === 'TEACHER';
    }

    public function isAdmin()
    {
        return $this->role === 'ADMIN';
    }

    public function isActive()
    {
        return $this->status === 'ACTIVE';
    }
}