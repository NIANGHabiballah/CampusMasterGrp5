package com.campusmaster.controller;

import com.campusmaster.entity.Forum;
import com.campusmaster.entity.Topic;
import com.campusmaster.entity.User;
import com.campusmaster.repository.ForumRepository;
import com.campusmaster.repository.TopicRepository;
import com.campusmaster.repository.UserRepository;
import com.campusmaster.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.ArrayNode;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/forums")
@CrossOrigin(origins = "http://localhost:3000")
public class ForumController {

    @Autowired
    private ForumRepository forumRepository;

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping
    public ResponseEntity<String> getAllForums() {
        try {
            List<Forum> forums = forumRepository.findAll();
            StringBuilder json = new StringBuilder("[");
            for (int i = 0; i < forums.size(); i++) {
                Forum forum = forums.get(i);
                int topicCount = topicRepository.findByForumId(forum.getId()).size();
                json.append("{\"id\":").append(forum.getId())
                    .append(",\"name\":\"").append(forum.getName().replace("\"", "\\\""))
                    .append("\",\"description\":\"").append(forum.getDescription().replace("\"", "\\\""))
                    .append("\",\"topicCount\":").append(topicCount)
                    .append("}")
                    .append(i < forums.size() - 1 ? "," : "");
            }
            json.append("]");
            return ResponseEntity.ok(json.toString());
        } catch (Exception e) {
            return ResponseEntity.ok("[]");
        }
    }

    @PostMapping
    public Forum createForum(@RequestBody Forum forum) {
        return forumRepository.save(forum);
    }

    @GetMapping("/{id}/topics")
    public ResponseEntity<String> getTopicsByForum(@PathVariable Long id) {
        try {
            List<Topic> topics = topicRepository.findByForumId(id);
            ArrayNode jsonArray = objectMapper.createArrayNode();
            
            for (Topic topic : topics) {
                int postCount = postRepository.findByTopicIdOrderByCreatedAtAsc(topic.getId()).size();
                
                ObjectNode topicJson = objectMapper.createObjectNode();
                topicJson.put("id", topic.getId());
                topicJson.put("title", topic.getTitle());
                topicJson.put("content", topic.getContent());
                topicJson.put("authorName", topic.getAuthor().getFirstName() + " " + topic.getAuthor().getLastName());
                topicJson.put("createdAt", topic.getCreatedAt().toString());
                topicJson.put("postCount", postCount);
                topicJson.put("views", topic.getViews() != null ? topic.getViews() : 0);
                jsonArray.add(topicJson);
            }
            
            return ResponseEntity.ok(jsonArray.toString());
        } catch (Exception e) {
            return ResponseEntity.ok("[]");
        }
    }

    @GetMapping("/topics/{id}")
    public ResponseEntity<String> getTopicById(@PathVariable Long id) {
        try {
            Topic topic = topicRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Topic not found"));
            
            String json = "{\"id\":" + topic.getId() +
                ",\"title\":\"" + topic.getTitle().replace("\"", "\\\"") + "\"" +
                ",\"content\":\"" + topic.getContent().replace("\"", "\\\"") + "\"" +
                ",\"authorName\":\"" + topic.getAuthor().getFirstName() + " " + topic.getAuthor().getLastName() + "\"" +
                ",\"createdAt\":\"" + topic.getCreatedAt() + "\"" +
                ",\"forumId\":" + topic.getForum().getId() +
                ",\"forumName\":\"" + topic.getForum().getName() + "\"" +
                "}";
            
            return ResponseEntity.ok(json);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/topics/{id}/posts")
    public ResponseEntity<String> getPostsByTopic(@PathVariable Long id) {
        return ResponseEntity.ok("[]");
    }

    @PostMapping("/topics")
    public ResponseEntity<String> createTopic(@RequestBody Map<String, Object> request) {
        try {
            Topic topic = new Topic();
            topic.setTitle((String) request.get("title"));
            topic.setContent((String) request.get("content"));
            topic.setPriority((String) request.get("priority"));

            Long forumId = Long.valueOf(request.get("forumId").toString());
            Forum forum = forumRepository.findById(forumId)
                .orElseThrow(() -> new RuntimeException("Forum not found"));
            topic.setForum(forum);

            User author = userRepository.findById(1L)
                .orElseThrow(() -> new RuntimeException("User not found"));
            topic.setAuthor(author);

            topicRepository.save(topic);
            return ResponseEntity.ok("{\"message\":\"Topic created successfully\"}");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }
}