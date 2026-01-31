package com.campusmaster.controller;

import com.campusmaster.entity.Post;
import com.campusmaster.entity.Topic;
import com.campusmaster.entity.User;
import com.campusmaster.repository.PostRepository;
import com.campusmaster.repository.TopicRepository;
import com.campusmaster.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.ArrayNode;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/topics")
@CrossOrigin(origins = "http://localhost:3000")
public class TopicController {

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping("/{id}")
    public ResponseEntity<String> getTopicById(@PathVariable Long id) {
        try {
            Topic topic = topicRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Topic not found"));
            
            ObjectNode json = objectMapper.createObjectNode();
            json.put("id", topic.getId());
            json.put("title", topic.getTitle());
            json.put("content", topic.getContent());
            json.put("authorName", topic.getAuthor().getFirstName() + " " + topic.getAuthor().getLastName());
            json.put("createdAt", topic.getCreatedAt().toString());
            json.put("forumId", topic.getForum().getId());
            json.put("forumName", topic.getForum().getName());
            json.put("views", topic.getViews() != null ? topic.getViews() : 0);
            json.put("likesCount", topic.getLikesCount() != null ? topic.getLikesCount() : 0);
            
            return ResponseEntity.ok(json.toString());
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}/posts")
    public ResponseEntity<String> getPostsByTopic(@PathVariable Long id) {
        try {
            List<Post> posts = postRepository.findByTopicIdOrderByCreatedAtAsc(id);
            ArrayNode jsonArray = objectMapper.createArrayNode();
            
            for (Post post : posts) {
                ObjectNode postJson = objectMapper.createObjectNode();
                postJson.put("id", post.getId());
                postJson.put("content", post.getContent());
                postJson.put("authorName", post.getAuthor().getFirstName() + " " + post.getAuthor().getLastName());
                postJson.put("createdAt", post.getCreatedAt().toString());
                postJson.put("likes", post.getLikesCount());
                postJson.put("isLiked", false);
                jsonArray.add(postJson);
            }
            
            return ResponseEntity.ok(jsonArray.toString());
        } catch (Exception e) {
            return ResponseEntity.ok("[]");
        }
    }

    @PostMapping("/{id}/posts")
    public ResponseEntity<String> createPost(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        try {
            Topic topic = topicRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Topic not found"));
            
            User author = userRepository.findById(1L)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            Post post = new Post();
            post.setContent((String) request.get("content"));
            post.setTopic(topic);
            post.setAuthor(author);
            
            postRepository.save(post);
            
            return ResponseEntity.ok("{\"message\":\"Post created successfully\"}");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    @PostMapping("/posts/{postId}/like")
    public ResponseEntity<String> likePost(@PathVariable Long postId) {
        try {
            Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
            
            post.setLikesCount(post.getLikesCount() + 1);
            postRepository.save(post);
            
            return ResponseEntity.ok("{\"message\":\"Post liked successfully\"}");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    @PostMapping("/{id}/view")
    public ResponseEntity<String> incrementViews(@PathVariable Long id) {
        try {
            Topic topic = topicRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Topic not found"));
            
            topic.setViews((topic.getViews() != null ? topic.getViews() : 0) + 1);
            topicRepository.save(topic);
            
            return ResponseEntity.ok("{\"message\":\"Views incremented\"}");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<String> likeTopic(@PathVariable Long id) {
        try {
            Topic topic = topicRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Topic not found"));
            
            topic.setLikesCount((topic.getLikesCount() != null ? topic.getLikesCount() : 0) + 1);
            topicRepository.save(topic);
            
            return ResponseEntity.ok("{\"message\":\"Topic liked successfully\"}");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }
}