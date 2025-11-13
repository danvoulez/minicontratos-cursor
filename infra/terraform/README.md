# Terraform Infrastructure for Minicontratos Platform

This Terraform configuration deploys the Minicontratos Platform to AWS using AWS Amplify (recommended for Next.js) or CloudFront + S3.

## 🚀 Quick Start

### Prerequisites

- Terraform >= 1.0
- AWS CLI configured with credentials
- AWS account with appropriate permissions

### Setup

1. **Copy example variables**
   ```bash
   cp terraform.tfvars.example terraform.tfvars
   ```

2. **Edit `terraform.tfvars`**
   ```hcl
   aws_region         = "us-east-1"
   project_name       = "minicontratos"
   environment        = "production"
   github_repo_url    = "https://github.com/danvoulez/minicontratos-platform"
   logline_api_key    = "your_actual_api_key"
   anthropic_api_key  = "your_actual_anthropic_key"
   ```

3. **Initialize Terraform**
   ```bash
   terraform init
   ```

4. **Plan deployment**
   ```bash
   terraform plan
   ```

5. **Apply configuration**
   ```bash
   terraform apply
   ```

6. **Get outputs**
   ```bash
   terraform output
   ```

## 📋 Resources Created

- **AWS Amplify App**: Full Next.js deployment with SSR support
- **Amplify Branch**: Main branch for production
- **S3 Bucket**: Static assets storage (if using CloudFront option)
- **CloudFront Distribution**: CDN for static assets (optional)

## 🔐 Security

- API keys are marked as `sensitive` in Terraform
- S3 buckets have public access blocked
- CloudFront uses HTTPS by default

## 🎯 Deployment Options

### Option 1: AWS Amplify (Recommended)

AWS Amplify is the recommended option for Next.js applications as it:
- Supports SSR out of the box
- Handles build and deployment automatically
- Provides CI/CD integration
- Manages SSL certificates

### Option 2: CloudFront + S3

For static exports only (not recommended for Next.js with SSR):
- Requires `next export` in build
- Limited SSR capabilities
- More manual configuration

## 📝 Notes

- The Amplify app will automatically build and deploy from the GitHub repository
- Environment variables are set in the Amplify app configuration
- Custom domain can be configured in AWS Amplify console

## 🔗 Next Steps

1. Configure custom domain in AWS Amplify console
2. Set up Route 53 DNS records
3. Configure SSL certificate (automatic with Amplify)
4. Set up monitoring and alerts

