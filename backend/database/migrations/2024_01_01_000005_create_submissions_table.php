<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('assignment_id')->constrained()->onDelete('cascade');
            $table->foreignId('student_id')->constrained('users')->onDelete('cascade');
            $table->json('files')->nullable();
            $table->text('content')->nullable();
            $table->timestamp('submitted_at')->useCurrent();
            $table->enum('status', ['SUBMITTED', 'GRADED', 'LATE', 'RESUBMITTED'])->default('SUBMITTED');
            $table->integer('grade')->nullable();
            $table->text('feedback')->nullable();
            $table->foreignId('graded_by')->nullable()->constrained('users');
            $table->timestamp('graded_at')->nullable();
            $table->timestamps();
            
            $table->unique(['assignment_id', 'student_id']);
            $table->index(['assignment_id']);
            $table->index(['student_id']);
            $table->index(['status']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('submissions');
    }
};