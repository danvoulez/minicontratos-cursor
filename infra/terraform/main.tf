terraform {
  required_version = ">= 1.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# S3 bucket for static assets (if needed)
resource "aws_s3_bucket" "minicontratos_static" {
  bucket = "${var.project_name}-static-${random_id.bucket_suffix.hex}"
  
  tags = {
    Name        = "${var.project_name}-static"
    Environment = var.environment
    Project     = "minicontratos"
  }
}

resource "aws_s3_bucket_public_access_block" "minicontratos_static" {
  bucket = aws_s3_bucket.minicontratos_static.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# CloudFront distribution for Next.js static export (optional)
resource "aws_cloudfront_distribution" "minicontratos" {
  enabled = true
  comment = "CloudFront distribution for ${var.project_name}"

  origin {
    domain_name = aws_s3_bucket.minicontratos_static.bucket_regional_domain_name
    origin_id   = "S3-${aws_s3_bucket.minicontratos_static.bucket}"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.minicontratos.cloudfront_access_identity_path
    }
  }

  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${aws_s3_bucket.minicontratos_static.bucket}"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = {
    Name        = "${var.project_name}-cdn"
    Environment = var.environment
  }
}

resource "aws_cloudfront_origin_access_identity" "minicontratos" {
  comment = "OAI for ${var.project_name}"
}

# Alternative: Use Amplify for Next.js (recommended for Next.js apps)
resource "aws_amplify_app" "minicontratos" {
  name       = var.project_name
  repository = var.github_repo_url
  platform   = "WEB"

  # Build settings
  build_spec = <<-EOT
    version: 1
    frontend:
      phases:
        preBuild:
          commands:
            - npm ci
        build:
          commands:
            - npm run build
      artifacts:
        baseDirectory: .next
        files:
          - '**/*'
      cache:
        paths:
          - node_modules/**/*
  EOT

  # Environment variables
  environment_variables = {
    NEXT_PUBLIC_API_URL         = var.logline_api_url
    NEXT_PUBLIC_GOOGLE_CLIENT_ID = var.google_client_id
    LOGLINE_API_KEY             = var.logline_api_key
    ANTHROPIC_API_KEY           = var.anthropic_api_key
  }

  # Custom rules for Next.js
  custom_rule {
    source = "/<*>"
    target = "/index.html"
    status = "200"
  }

  tags = {
    Name        = var.project_name
    Environment = var.environment
  }
}

resource "aws_amplify_branch" "main" {
  app_id      = aws_amplify_app.minicontratos.id
  branch_name = "main"

  framework = "Next.js - SSR"
}

# Random ID for bucket suffix
resource "random_id" "bucket_suffix" {
  byte_length = 4
}

# Outputs
output "amplify_app_id" {
  value       = aws_amplify_app.minicontratos.id
  description = "Amplify App ID"
}

output "amplify_app_url" {
  value       = "https://${aws_amplify_branch.main.branch_name}.${aws_amplify_app.minicontratos.default_domain}"
  description = "Amplify App URL"
}

output "cloudfront_url" {
  value       = aws_cloudfront_distribution.minicontratos.domain_name
  description = "CloudFront Distribution URL"
}

output "s3_bucket_name" {
  value       = aws_s3_bucket.minicontratos_static.bucket
  description = "S3 Bucket Name"
}

