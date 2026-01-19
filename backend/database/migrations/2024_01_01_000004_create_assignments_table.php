<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('assignments', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->foreignId('course_id')->constrained()->onDelete('cascade');
            $table->timestamp('due_date');
            $table->integer('max_points')->default(100);
            $table->enum('status', ['DRAFT', 'PUBLISHED', 'CLOSED'])->default('DRAFT');
            $table->json('attachments')->nullable();
            $table->boolean('allow_late_submission')->default(false);
            $table->integer('late_penalty_percent')->default(0);
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['course_id']);
            $table->index(['due_date']);
            $table->index(['status']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('assignments');
    }
};