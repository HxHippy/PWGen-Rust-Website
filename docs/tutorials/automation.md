---
sidebar_position: 1
---

# Automation and Scripting

Learn how to automate PWGen-Rust operations for efficient password management in scripts, CI/CD pipelines, and system administration.

## Introduction

PWGen-Rust CLI is designed with automation in mind, providing machine-readable output, consistent exit codes, and non-interactive modes perfect for scripting and automated workflows.

## Basic Automation Concepts

### Non-Interactive Mode

Enable non-interactive mode to prevent prompts that would hang automated scripts:

```bash
# Using environment variable
export PWGEN_NON_INTERACTIVE=1

# Using command flag
pwgen-cli --non-interactive password list

# In configuration file
[cli]
non_interactive = true
```

### Machine-Readable Output

Use structured output formats for parsing in scripts:

```bash
# JSON output for parsing
pwgen-cli --format json password list

# CSV for spreadsheet integration
pwgen-cli --format csv password list

# Raw values for direct use
pwgen-cli password copy --site github.com --raw
```

### Exit Code Handling

Always check exit codes in automation scripts:

```bash
#!/bin/bash
set -e  # Exit on any error

if pwgen-cli vault status > /dev/null 2>&1; then
    echo "Vault is accessible"
else
    echo "Vault is locked or inaccessible"
    exit 1
fi
```

## Environment Setup

### Secure Credential Storage

Never hardcode passwords in scripts. Use environment variables or secure credential stores:

```bash
#!/bin/bash

# Method 1: Environment variables (for development)
export PWGEN_VAULT_PATH="/secure/vault.db"

# Method 2: Read from secure file
VAULT_PATH=$(cat ~/.config/pwgen/vault_path)

# Method 3: Use system keyring
MASTER_PASS=$(security find-generic-password -s "pwgen-master" -w)
```

### Configuration for Automation

Create a dedicated configuration for automated environments:

```toml
# ~/.config/pwgen/automation.toml
[general]
default_vault = "/var/lib/pwgen/automation.vault"
confirm_destructive = false
log_file = "/var/log/pwgen/automation.log"

[cli]
non_interactive = true
default_format = "json"
max_results = 10000

[output]
colors = false
unicode = false

[security]
audit_log = true
audit_log_file = "/var/log/pwgen/audit.log"

[backup]
backup_directory = "/var/backups/pwgen"
verify_after_create = true
```

## Scripting Examples

### Daily Backup Script

Automated daily backup with rotation:

```bash
#!/bin/bash
# daily-backup.sh

set -euo pipefail

# Configuration
BACKUP_DIR="/var/backups/pwgen"
RETENTION_DAYS=30
DATE=$(date +%Y%m%d)
BACKUP_FILE="$BACKUP_DIR/vault-backup-$DATE.pwgen"

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Create backup
echo "Creating backup: $BACKUP_FILE"
if pwgen-cli backup create --output "$BACKUP_FILE" --compression 9; then
    echo "Backup created successfully"
    
    # Verify backup
    if pwgen-cli backup verify --file "$BACKUP_FILE"; then
        echo "Backup verified successfully"
    else
        echo "Backup verification failed!"
        exit 1
    fi
    
    # Clean old backups
    find "$BACKUP_DIR" -name "vault-backup-*.pwgen" -mtime +$RETENTION_DAYS -delete
    echo "Old backups cleaned"
    
else
    echo "Backup creation failed!"
    exit 1
fi
```

### Password Strength Audit

Weekly security audit script:

```bash
#!/bin/bash
# security-audit.sh

set -euo pipefail

# Configuration
REPORT_DIR="/var/reports/pwgen"
DATE=$(date +%Y%m%d)
REPORT_FILE="$REPORT_DIR/security-audit-$DATE.html"

mkdir -p "$REPORT_DIR"

echo "Starting security audit..."

# Check for weak passwords
echo "Checking for weak passwords..."
WEAK_COUNT=$(pwgen-cli analyze weak --format json | jq '. | length')
echo "Found $WEAK_COUNT weak passwords"

# Check for duplicates
echo "Checking for duplicate passwords..."
DUPLICATE_COUNT=$(pwgen-cli analyze duplicates --format json | jq '. | length')
echo "Found $DUPLICATE_COUNT duplicate passwords"

# Check for old passwords
echo "Checking for old passwords (>90 days)..."
OLD_COUNT=$(pwgen-cli analyze old --max-age 90 --format json | jq '. | length')
echo "Found $OLD_COUNT old passwords"

# Generate comprehensive report
pwgen-cli analyze strength --export "$REPORT_FILE"

# Send alert if issues found
if [ $((WEAK_COUNT + DUPLICATE_COUNT + OLD_COUNT)) -gt 0 ]; then
    echo "Security issues found! Report: $REPORT_FILE"
    # Send notification (customize for your environment)
    # mail -s "PWGen Security Audit Alert" admin@company.com < "$REPORT_FILE"
fi

echo "Security audit completed"
```

### Bulk Password Generation

Generate passwords for multiple new accounts:

```bash
#!/bin/bash
# bulk-password-generation.sh

set -euo pipefail

# Read services from file or command line
SERVICES_FILE="${1:-services.txt}"

if [[ ! -f "$SERVICES_FILE" ]]; then
    echo "Usage: $0 <services-file>"
    echo "Services file format: service_name username tags"
    exit 1
fi

# Process each service
while IFS=' ' read -r service username tags; do
    # Skip empty lines and comments
    [[ -z "$service" || "$service" =~ ^#.*$ ]] && continue
    
    echo "Generating password for $service ($username)..."
    
    # Generate strong password
    password=$(pwgen-cli generate --length 20 --symbols --no-ambiguous)
    
    # Add to vault
    if pwgen-cli password add \
        --site "$service" \
        --username "$username" \
        --password "$password" \
        --tags "$tags" \
        --notes "Auto-generated on $(date)"; then
        echo "✓ Added entry for $service"
    else
        echo "✗ Failed to add entry for $service"
    fi
    
done < "$SERVICES_FILE"

echo "Bulk password generation completed"
```

### Database Maintenance

Regular vault maintenance and optimization:

```bash
#!/bin/bash
# maintenance.sh

set -euo pipefail

echo "Starting PWGen vault maintenance..."

# Check vault status
if ! pwgen-cli vault status > /dev/null 2>&1; then
    echo "Vault is not accessible"
    exit 1
fi

# Get vault statistics
TOTAL_ENTRIES=$(pwgen-cli password list --format json | jq '. | length')
echo "Total entries: $TOTAL_ENTRIES"

# Find and report issues
echo "Analyzing vault..."

# Entries without tags
UNTAGGED=$(pwgen-cli password list --format json | jq '[.[] | select(.tags | length == 0)] | length')
echo "Untagged entries: $UNTAGGED"

# Entries with empty notes
EMPTY_NOTES=$(pwgen-cli password list --format json | jq '[.[] | select(.notes == "" or .notes == null)] | length')
echo "Entries with empty notes: $EMPTY_NOTES"

# Recent activity (last 7 days)
RECENT=$(pwgen-cli password list --newer-than "7 days" --format json | jq '. | length')
echo "Recent entries (7 days): $RECENT"

# Create maintenance backup
BACKUP_FILE="/var/backups/pwgen/maintenance-$(date +%Y%m%d-%H%M).pwgen"
pwgen-cli backup create --output "$BACKUP_FILE"
echo "Maintenance backup created: $BACKUP_FILE"

echo "Maintenance completed"
```

## CI/CD Integration

### GitHub Actions

Integrate PWGen into GitHub Actions workflows:

```yaml
# .github/workflows/deploy.yml
name: Deploy Application

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Install PWGen-Rust
        run: |
          curl -sSL https://github.com/HxHippy/PWGen/releases/latest/download/install.sh | bash
          echo "$HOME/.local/bin" >> $GITHUB_PATH
      
      - name: Setup PWGen vault
        env:
          VAULT_DATA: ${{ secrets.PWGEN_VAULT_BASE64 }}
        run: |
          echo "$VAULT_DATA" | base64 -d > vault.db
          export PWGEN_VAULT_PATH="$PWD/vault.db"
      
      - name: Get deployment credentials
        id: credentials
        run: |
          API_KEY=$(pwgen-cli password copy --site "production-api" --raw)
          echo "::add-mask::$API_KEY"
          echo "api_key=$API_KEY" >> $GITHUB_OUTPUT
          
          DB_PASSWORD=$(pwgen-cli password copy --site "production-db" --raw)
          echo "::add-mask::$DB_PASSWORD"
          echo "db_password=$DB_PASSWORD" >> $GITHUB_OUTPUT
      
      - name: Deploy application
        env:
          API_KEY: ${{ steps.credentials.outputs.api_key }}
          DB_PASSWORD: ${{ steps.credentials.outputs.db_password }}
        run: |
          # Your deployment script here
          ./deploy.sh
```

### GitLab CI

PWGen integration in GitLab CI pipelines:

```yaml
# .gitlab-ci.yml
stages:
  - deploy

deploy_production:
  stage: deploy
  image: alpine:latest
  
  before_script:
    - apk add --no-cache curl bash
    - curl -sSL https://github.com/HxHippy/PWGen/releases/latest/download/install.sh | bash
    - export PATH="$HOME/.local/bin:$PATH"
    
  script:
    # Setup vault from GitLab secret
    - echo "$VAULT_DATA" | base64 -d > vault.db
    - export PWGEN_VAULT_PATH="$PWD/vault.db"
    
    # Get credentials
    - API_KEY=$(pwgen-cli password copy --site "gitlab-deploy-api" --raw)
    - DB_PASS=$(pwgen-cli password copy --site "production-database" --raw)
    
    # Deploy with credentials
    - ./deploy.sh "$API_KEY" "$DB_PASS"
    
  only:
    - main
  
  variables:
    PWGEN_NON_INTERACTIVE: "1"
    PWGEN_FORMAT: "json"
```

### Jenkins Pipeline

Jenkins pipeline with PWGen integration:

```groovy
pipeline {
    agent any
    
    environment {
        PWGEN_NON_INTERACTIVE = '1'
        PWGEN_FORMAT = 'json'
    }
    
    stages {
        stage('Setup') {
            steps {
                script {
                    // Install PWGen if not present
                    sh '''
                        if ! command -v pwgen-cli &> /dev/null; then
                            curl -sSL https://github.com/HxHippy/PWGen/releases/latest/download/install.sh | bash
                            export PATH="$HOME/.local/bin:$PATH"
                        fi
                    '''
                }
            }
        }
        
        stage('Get Credentials') {
            steps {
                withCredentials([file(credentialsId: 'pwgen-vault', variable: 'VAULT_FILE')]) {
                    script {
                        env.PWGEN_VAULT_PATH = env.VAULT_FILE
                        
                        // Get deployment credentials
                        env.API_KEY = sh(
                            script: 'pwgen-cli password copy --site "jenkins-api" --raw',
                            returnStdout: true
                        ).trim()
                        
                        env.DB_PASSWORD = sh(
                            script: 'pwgen-cli password copy --site "jenkins-db" --raw',
                            returnStdout: true
                        ).trim()
                    }
                }
            }
        }
        
        stage('Deploy') {
            steps {
                sh './deploy.sh "$API_KEY" "$DB_PASSWORD"'
            }
        }
    }
    
    post {
        always {
            // Clean up sensitive environment variables
            script {
                env.API_KEY = null
                env.DB_PASSWORD = null
            }
        }
    }
}
```

## System Administration

### User Onboarding Automation

Automate new user account creation:

```bash
#!/bin/bash
# onboard-user.sh

set -euo pipefail

# Parse arguments
if [[ $# -lt 3 ]]; then
    echo "Usage: $0 <username> <email> <department>"
    exit 1
fi

USERNAME="$1"
EMAIL="$2"
DEPARTMENT="$3"

echo "Onboarding user: $USERNAME ($EMAIL) - $DEPARTMENT"

# Define services based on department
case "$DEPARTMENT" in
    "engineering")
        SERVICES=("github" "jira" "confluence" "aws" "docker-registry")
        ;;
    "marketing")
        SERVICES=("salesforce" "hubspot" "canva" "analytics")
        ;;
    "hr")
        SERVICES=("workday" "slack" "zoom" "benefits-portal")
        ;;
    *)
        SERVICES=("email" "slack" "zoom")
        ;;
esac

# Generate accounts for each service
for service in "${SERVICES[@]}"; do
    echo "Creating account for $service..."
    
    # Generate secure password
    password=$(pwgen-cli generate --length 16 --symbols --no-ambiguous)
    
    # Add to vault with user-specific tags
    pwgen-cli password add \
        --site "$service.company.com" \
        --username "$USERNAME" \
        --password "$password" \
        --tags "onboarding,$DEPARTMENT,$USERNAME" \
        --notes "Created for $EMAIL on $(date)" \
        --url "https://$service.company.com/login"
    
    echo "✓ Created $service account"
done

# Generate onboarding report
REPORT_FILE="/tmp/onboarding-$USERNAME-$(date +%Y%m%d).csv"
pwgen-cli password list --tag "$USERNAME" --format csv > "$REPORT_FILE"

echo "Onboarding completed for $USERNAME"
echo "Credentials report: $REPORT_FILE"

# Send secure report (customize for your email system)
# gpg --encrypt --recipient "$EMAIL" "$REPORT_FILE"
# mail -s "Your new account credentials" "$EMAIL" < "$REPORT_FILE.gpg"
```

### Password Rotation

Automated password rotation system:

```bash
#!/bin/bash
# rotate-passwords.sh

set -euo pipefail

# Configuration
ROTATION_INTERVAL_DAYS=90
NOTIFICATION_EMAIL="security@company.com"

echo "Starting password rotation check..."

# Get passwords older than rotation interval
OLD_PASSWORDS=$(pwgen-cli password list \
    --older-than "${ROTATION_INTERVAL_DAYS} days" \
    --format json \
    --tag "auto-rotate")

if [[ $(echo "$OLD_PASSWORDS" | jq '. | length') -eq 0 ]]; then
    echo "No passwords need rotation"
    exit 0
fi

echo "Found $(echo "$OLD_PASSWORDS" | jq '. | length') passwords needing rotation"

# Process each password
echo "$OLD_PASSWORDS" | jq -r '.[] | @base64' | while read -r encoded_entry; do
    entry=$(echo "$encoded_entry" | base64 -d)
    site=$(echo "$entry" | jq -r '.site')
    username=$(echo "$entry" | jq -r '.username')
    
    echo "Rotating password for $site ($username)..."
    
    # Generate new password
    new_password=$(pwgen-cli generate --length 20 --symbols --no-ambiguous)
    
    # Update in vault
    pwgen-cli password update \
        --site "$site" \
        --password "$new_password" \
        --add-tags "rotated-$(date +%Y%m%d)" \
        --notes "Automatically rotated on $(date)"
    
    echo "✓ Rotated password for $site"
    
    # Log rotation for audit
    echo "$(date): Rotated password for $site ($username)" >> /var/log/pwgen/rotations.log
done

echo "Password rotation completed"

# Send notification
if command -v mail > /dev/null; then
    echo "Password rotation completed on $(date)" | \
        mail -s "PWGen Password Rotation Report" "$NOTIFICATION_EMAIL"
fi
```

### Health Monitoring

Monitor PWGen vault health and performance:

```bash
#!/bin/bash
# health-check.sh

set -euo pipefail

# Configuration
ALERT_THRESHOLD_WEAK=10
ALERT_THRESHOLD_DUPLICATES=5
ALERT_THRESHOLD_OLD=50

echo "Starting PWGen health check..."

# Check vault accessibility
if ! pwgen-cli vault status > /dev/null 2>&1; then
    echo "CRITICAL: Vault is not accessible"
    exit 2
fi

# Get metrics
TOTAL_ENTRIES=$(pwgen-cli password list --format json | jq '. | length')
WEAK_PASSWORDS=$(pwgen-cli analyze weak --format json | jq '. | length')
DUPLICATE_PASSWORDS=$(pwgen-cli analyze duplicates --format json | jq '. | length')
OLD_PASSWORDS=$(pwgen-cli analyze old --max-age 90 --format json | jq '. | length')

# Performance metrics
VAULT_SIZE=$(du -h "$PWGEN_VAULT_PATH" | cut -f1)
LAST_BACKUP=$(find /var/backups/pwgen -name "*.pwgen" -printf "%T@ %p\n" | sort -n | tail -1 | cut -d' ' -f2-)

echo "=== PWGen Health Report ==="
echo "Total entries: $TOTAL_ENTRIES"
echo "Vault size: $VAULT_SIZE"
echo "Weak passwords: $WEAK_PASSWORDS"
echo "Duplicate passwords: $DUPLICATE_PASSWORDS"
echo "Old passwords (>90 days): $OLD_PASSWORDS"
echo "Last backup: $LAST_BACKUP"

# Health score calculation
HEALTH_SCORE=100

if [[ $WEAK_PASSWORDS -gt $ALERT_THRESHOLD_WEAK ]]; then
    HEALTH_SCORE=$((HEALTH_SCORE - 30))
    echo "WARNING: Too many weak passwords"
fi

if [[ $DUPLICATE_PASSWORDS -gt $ALERT_THRESHOLD_DUPLICATES ]]; then
    HEALTH_SCORE=$((HEALTH_SCORE - 20))
    echo "WARNING: Too many duplicate passwords"
fi

if [[ $OLD_PASSWORDS -gt $ALERT_THRESHOLD_OLD ]]; then
    HEALTH_SCORE=$((HEALTH_SCORE - 25))
    echo "WARNING: Too many old passwords"
fi

# Check backup age
if [[ -z "$LAST_BACKUP" ]] || [[ $(find "$LAST_BACKUP" -mtime +7) ]]; then
    HEALTH_SCORE=$((HEALTH_SCORE - 25))
    echo "WARNING: Backup is more than 7 days old"
fi

echo "Health score: $HEALTH_SCORE/100"

# Exit with appropriate code
if [[ $HEALTH_SCORE -lt 70 ]]; then
    echo "CRITICAL: Health score below threshold"
    exit 2
elif [[ $HEALTH_SCORE -lt 85 ]]; then
    echo "WARNING: Health score could be better"
    exit 1
else
    echo "OK: Vault health is good"
    exit 0
fi
```

## Best Practices

### Security Considerations

1. **Never Log Sensitive Data**:
   ```bash
   # Good: Use exit codes and generic messages
   if pwgen-cli password copy --site "$SITE" > /dev/null 2>&1; then
       echo "Password copied successfully"
   else
       echo "Failed to copy password"
   fi
   
   # Bad: Don't log actual passwords
   # password=$(pwgen-cli password copy --site "$SITE" --raw)
   # echo "Password is: $password"  # NEVER DO THIS
   ```

2. **Secure File Permissions**:
   ```bash
   # Set restrictive permissions on scripts
   chmod 750 /usr/local/bin/pwgen-automation.sh
   
   # Protect configuration files
   chmod 600 /etc/pwgen/automation.toml
   
   # Secure log files
   chmod 640 /var/log/pwgen/automation.log
   ```

3. **Error Handling**:
   ```bash
   # Always use error handling
   set -euo pipefail
   
   # Trap errors for cleanup
   trap 'echo "Error on line $LINENO"' ERR
   
   # Validate inputs
   if [[ -z "${SITE:-}" ]]; then
       echo "ERROR: SITE variable not set"
       exit 1
   fi
   ```

### Performance Optimization

1. **Limit Result Sets**:
   ```bash
   # Use limits for large vaults
   pwgen-cli password list --limit 100
   
   # Filter results appropriately
   pwgen-cli password list --tag "production" --newer-than "30 days"
   ```

2. **Batch Operations**:
   ```bash
   # Process in batches for large operations
   pwgen-cli password list --format json | \
       jq -r '.[0:100] | .[] | .site' | \
       while read -r site; do
           # Process each site
           echo "Processing $site"
       done
   ```

3. **Caching**:
   ```bash
   # Cache frequently accessed data
   CACHE_FILE="/tmp/pwgen-cache-$(date +%Y%m%d)"
   
   if [[ ! -f "$CACHE_FILE" || $(find "$CACHE_FILE" -mmin +60) ]]; then
       pwgen-cli password list --format json > "$CACHE_FILE"
   fi
   
   # Use cached data
   jq '.[] | select(.tags[] == "production")' < "$CACHE_FILE"
   ```

### Error Recovery

1. **Backup Before Changes**:
   ```bash
   # Always backup before bulk operations
   BACKUP_FILE="/tmp/pre-operation-backup-$(date +%Y%m%d-%H%M%S).pwgen"
   pwgen-cli backup create --output "$BACKUP_FILE"
   
   # Store backup location for recovery
   echo "$BACKUP_FILE" > /tmp/last-backup-location
   ```

2. **Rollback Procedures**:
   ```bash
   # Implement rollback function
   rollback() {
       local backup_file="$1"
       echo "Rolling back to $backup_file"
       pwgen-cli restore --file "$backup_file" --force
   }
   
   # Use in error handling
   trap 'rollback "$(cat /tmp/last-backup-location)"' ERR
   ```

## Integration Examples

### Docker Container

Run PWGen automation in Docker:

```dockerfile
FROM alpine:latest

RUN apk add --no-cache bash curl jq

# Install PWGen-Rust
RUN curl -sSL https://github.com/HxHippy/PWGen/releases/latest/download/install.sh | bash

COPY automation-scripts/ /usr/local/bin/
COPY config/ /etc/pwgen/

VOLUME ["/var/lib/pwgen", "/var/log/pwgen"]

ENTRYPOINT ["/usr/local/bin/pwgen-automation.sh"]
```

### Kubernetes CronJob

Schedule PWGen automation in Kubernetes:

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: pwgen-backup
spec:
  schedule: "0 2 * * *"  # Daily at 2 AM
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: pwgen-backup
            image: pwgen-automation:latest
            command: ["/usr/local/bin/backup-automation.sh"]
            env:
            - name: PWGEN_VAULT_PATH
              value: "/var/lib/pwgen/vault.db"
            - name: PWGEN_NON_INTERACTIVE
              value: "1"
            volumeMounts:
            - name: vault-storage
              mountPath: /var/lib/pwgen
            - name: backup-storage
              mountPath: /var/backups/pwgen
          volumes:
          - name: vault-storage
            persistentVolumeClaim:
              claimName: pwgen-vault
          - name: backup-storage
            persistentVolumeClaim:
              claimName: pwgen-backups
          restartPolicy: OnFailure
```

### Ansible Playbook

Automate PWGen deployment and configuration:

```yaml
---
- name: Deploy PWGen automation
  hosts: pwgen_servers
  become: yes
  
  tasks:
    - name: Install PWGen-Rust
      shell: |
        curl -sSL https://github.com/HxHippy/PWGen/releases/latest/download/install.sh | bash
      args:
        creates: /usr/local/bin/pwgen-cli
    
    - name: Create pwgen user
      user:
        name: pwgen
        system: yes
        shell: /bin/bash
        home: /var/lib/pwgen
    
    - name: Create directories
      file:
        path: "{{ item }}"
        state: directory
        owner: pwgen
        group: pwgen
        mode: '0750'
      loop:
        - /var/lib/pwgen
        - /var/log/pwgen
        - /var/backups/pwgen
    
    - name: Copy automation scripts
      copy:
        src: "{{ item }}"
        dest: /usr/local/bin/
        owner: root
        group: root
        mode: '0755'
      loop:
        - scripts/daily-backup.sh
        - scripts/security-audit.sh
        - scripts/health-check.sh
    
    - name: Setup cron jobs
      cron:
        name: "{{ item.name }}"
        job: "{{ item.job }}"
        minute: "{{ item.minute }}"
        hour: "{{ item.hour }}"
        user: pwgen
      loop:
        - name: "Daily backup"
          job: "/usr/local/bin/daily-backup.sh"
          minute: "0"
          hour: "2"
        - name: "Weekly security audit"
          job: "/usr/local/bin/security-audit.sh"
          minute: "0"
          hour: "3"
```

## See Also

- [CLI Commands](../cli/commands) - Complete command reference
- [CLI Configuration](../cli/configuration) - Configuration options
- [Security Architecture](../security/architecture) - Security considerations
- [Team Usage](team-usage) - Collaborative workflows