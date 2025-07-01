CREATE DATABASE social_media;
USE social_media;

-- Users table
CREATE TABLE `users` (
  `user_id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(191) NOT NULL UNIQUE,
  `email` VARCHAR(191) NOT NULL,
  `profile_photo_url` VARCHAR(191) DEFAULT 'https://picsum.photos/100',
  `bio` TEXT,
  `status` VARCHAR(191) DEFAULT 'active',
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
);

-- Post table
CREATE TABLE `post` (
  `post_id` INT AUTO_INCREMENT PRIMARY KEY,
  `photo_id` INT,
  `video_id` INT,
  `user_id` INT NOT NULL,
  `caption` TEXT,
  `location` VARCHAR(191),
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CONSTRAINT `post_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`)
);

-- Photos table
CREATE TABLE `photos` (
  `photo_id` INT AUTO_INCREMENT PRIMARY KEY,
  `photo_url` VARCHAR(191) NOT NULL UNIQUE,
  `post_id` INT NOT NULL UNIQUE,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `size` DOUBLE NOT NULL,
  CONSTRAINT `photos_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `post`(`post_id`) ON DELETE CASCADE
);

-- Videos table
CREATE TABLE `videos` (
  `video_id` INT AUTO_INCREMENT PRIMARY KEY,
  `video_url` VARCHAR(191) NOT NULL UNIQUE,
  `post_id` INT NOT NULL UNIQUE,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `size` DOUBLE NOT NULL,
  CONSTRAINT `videos_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `post`(`post_id`) ON DELETE CASCADE
);

-- Comments table
CREATE TABLE `comments` (
  `comment_id` INT AUTO_INCREMENT PRIMARY KEY,
  `comment_text` TEXT NOT NULL,
  `post_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CONSTRAINT `comments_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `post`(`post_id`),
  CONSTRAINT `comments_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`)
);

-- Post Likes table
CREATE TABLE `post_likes` (
  `user_id` INT NOT NULL,
  `post_id` INT NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`user_id`, `post_id`),
  CONSTRAINT `post_likes_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`),
  CONSTRAINT `post_likes_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `post`(`post_id`)
);

-- Comment Likes table
CREATE TABLE `comment_likes` (
  `user_id` INT NOT NULL,
  `comment_id` INT NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`user_id`, `comment_id`),
  CONSTRAINT `comment_likes_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`),
  CONSTRAINT `comment_likes_comment_id_fkey` FOREIGN KEY (`comment_id`) REFERENCES `comments`(`comment_id`)
);

-- Follows table
CREATE TABLE `follows` (
  `follower_id` INT NOT NULL,
  `followee_id` INT NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`follower_id`, `followee_id`),
  CONSTRAINT `follows_follower_id_fkey` FOREIGN KEY (`follower_id`) REFERENCES `users`(`user_id`),
  CONSTRAINT `follows_followee_id_fkey` FOREIGN KEY (`followee_id`) REFERENCES `users`(`user_id`)
);

-- Hashtags table
CREATE TABLE `hashtags` (
  `hashtag_id` INT AUTO_INCREMENT PRIMARY KEY,
  `hashtag_name` VARCHAR(191) NOT NULL UNIQUE,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
);

-- Hashtag Follow table
CREATE TABLE `hashtag_follow` (
  `user_id` INT NOT NULL,
  `hashtag_id` INT NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`user_id`, `hashtag_id`),
  CONSTRAINT `hashtag_follow_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`),
  CONSTRAINT `hashtag_follow_hashtag_id_fkey` FOREIGN KEY (`hashtag_id`) REFERENCES `hashtags`(`hashtag_id`)
);

-- Post Tags table
CREATE TABLE `post_tags` (
  `post_id` INT NOT NULL,
  `hashtag_id` INT NOT NULL,
  PRIMARY KEY (`post_id`, `hashtag_id`),
  CONSTRAINT `post_tags_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `post`(`post_id`),
  CONSTRAINT `post_tags_hashtag_id_fkey` FOREIGN KEY (`hashtag_id`) REFERENCES `hashtags`(`hashtag_id`)
);

-- Bookmarks table
CREATE TABLE `bookmarks` (
  `post_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`user_id`, `post_id`),
  CONSTRAINT `bookmarks_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `post`(`post_id`),
  CONSTRAINT `bookmarks_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`)
);

-- Login table
CREATE TABLE `login` (
  `login_id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `ip` VARCHAR(191) NOT NULL,
  `login_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CONSTRAINT `login_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`)
);

-- Moderators table
CREATE TABLE `moderators` (
  `moderator_id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL UNIQUE,
  `role` VARCHAR(191) NOT NULL DEFAULT 'moderator',
  `permissions` JSON NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CONSTRAINT `moderators_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`)
);

-- Post Flags table
CREATE TABLE `post_flags` (
  `flag_id` INT AUTO_INCREMENT PRIMARY KEY,
  `post_id` INT NOT NULL,
  `reported_by` INT NOT NULL,
  `reason` TEXT NOT NULL,
  `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `resolved_at` DATETIME(3),
  `resolved_by` INT,
  CONSTRAINT `post_flags_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `post`(`post_id`),
  CONSTRAINT `post_flags_reported_by_fkey` FOREIGN KEY (`reported_by`) REFERENCES `users`(`user_id`),
  CONSTRAINT `post_flags_resolved_by_fkey` FOREIGN KEY (`resolved_by`) REFERENCES `users`(`user_id`)
);