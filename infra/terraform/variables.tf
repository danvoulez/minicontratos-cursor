variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "minicontratos"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

variable "github_repo_url" {
  description = "GitHub repository URL"
  type        = string
  default     = "https://github.com/danvoulez/minicontratos-platform"
}

variable "logline_api_url" {
  description = "LogLine API URL"
  type        = string
  default     = "https://qo960fhrv0.execute-api.us-east-1.amazonaws.com"
}

variable "google_client_id" {
  description = "Google OAuth Client ID"
  type        = string
  default     = "206533069705-vpr05og8c8faijssgkkka2itkr0epupm.apps.googleusercontent.com"
}

variable "logline_api_key" {
  description = "LogLine API Key (sensitive)"
  type        = string
  sensitive   = true
}

variable "anthropic_api_key" {
  description = "Anthropic API Key (sensitive, optional)"
  type        = string
  sensitive   = true
  default     = ""
}

