---
sidebar_position: 2
---

# Migration from Other Password Managers

Comprehensive guide to migrating your passwords and data from other password managers to PWGen-Rust.

## Overview

PWGen-Rust supports importing from all major password managers and browsers, making migration straightforward and secure. This guide covers step-by-step migration processes, best practices, and troubleshooting.

## Supported Sources

### Password Managers
- **LastPass** - Direct CSV export import
- **Bitwarden** - Native export format support
- **1Password** - CSV and JSON export support
- **KeePass/KeePassXC** - KDBX and CSV support
- **Dashlane** - CSV export import
- **RoboForm** - CSV export support
- **Enpass** - CSV export support

### Browsers
- **Chrome/Chromium** - Direct password import
- **Firefox** - Profile-based import
- **Safari** - Keychain integration
- **Microsoft Edge** - Direct import
- **Opera** - Browser data import
- **Brave** - Chromium-based import

### Generic Sources
- **CSV files** - Custom format support
- **JSON files** - Structured data import
- **Text files** - Line-based password lists

## Before You Start

### Pre-Migration Checklist

1. **Backup Current Data**:
   ```bash
   # Create a backup of your current PWGen vault (if you have one)
   pwgen-cli backup create --output pre-migration-backup.pwgen
   ```

2. **Export from Source**:
   - Follow your current password manager's export process
   - Choose CSV format when possible for best compatibility
   - Note any special characters or formatting in your data

3. **Security Considerations**:
   - Export files contain unencrypted passwords
   - Work on a secure, private computer
   - Delete export files after successful import
   - Consider using an encrypted drive or folder

4. **Verify Source Data**:
   - Check export file for completeness
   - Verify special characters display correctly
   - Note any entries that might need manual cleanup

## Migration Guides by Source

### LastPass Migration

LastPass is one of the most common migration sources. Here's the complete process:

#### Step 1: Export from LastPass

1. Log into LastPass web vault
2. Go to **Account Options** → **Advanced** → **Export**
3. Choose **LastPass CSV File**
4. Save as `lastpass_export.csv`

#### Step 2: Import to PWGen-Rust

```bash
# Basic import
pwgen-cli import lastpass --file lastpass_export.csv

# Preview import first (recommended)
pwgen-cli import lastpass --file lastpass_export.csv --dry-run

# Import with backup
pwgen-cli import lastpass --file lastpass_export.csv --backup-before-import

# Merge with existing entries
pwgen-cli import lastpass --file lastpass_export.csv --merge
```

#### Step 3: Verify Import

```bash
# Check total entries
pwgen-cli password list --format table

# Look for any issues
pwgen-cli password list --format json | jq '.[] | select(.site == "" or .username == "")'

# Check specific entries
pwgen-cli password search "example.com"
```

### Bitwarden Migration

Bitwarden provides excellent export options:

#### Step 1: Export from Bitwarden

**Web Vault Method:**
1. Login to Bitwarden web vault
2. Go to **Tools** → **Export Vault**
3. Choose **JSON** format for best results
4. Save as `bitwarden_export.json`

**CLI Method:**
```bash
# Login to Bitwarden CLI
bw login

# Export vault
bw export --output bitwarden_export.json --format json
```

#### Step 2: Import to PWGen-Rust

```bash
# Import JSON export
pwgen-cli import bitwarden --file bitwarden_export.json

# Or CSV if you exported that format
pwgen-cli import csv --file bitwarden_export.csv --format bitwarden
```

### 1Password Migration

1Password has specific export requirements:

#### Step 1: Export from 1Password

**Desktop App Method:**
1. Open 1Password desktop app
2. Select all items in a vault
3. **File** → **Export** → **All Items**
4. Choose **CSV** format
5. Save as `1password_export.csv`

#### Step 2: Import to PWGen-Rust

```bash
# Import 1Password CSV
pwgen-cli import 1password --file 1password_export.csv

# Handle multiple vaults
pwgen-cli import 1password --file personal_vault.csv --tag "personal"
pwgen-cli import 1password --file work_vault.csv --tag "work"
```

### KeePass Migration

KeePass requires special handling due to its database format:

#### Step 1: Export from KeePass

**KeePass Classic:**
1. **File** → **Export** → **Generic CSV**
2. Choose all fields
3. Save as `keepass_export.csv`

**KeePassXC:**
1. **Database** → **Export** → **CSV**
2. Include all fields
3. Save as `keepassx_export.csv`

#### Step 2: Import to PWGen-Rust

```bash
# Import KeePass CSV
pwgen-cli import keepass --file keepass_export.csv

# Handle custom fields
pwgen-cli import csv --file keepass_export.csv --map-fields "Title:site,Username:username,Password:password,URL:url,Notes:notes"
```

### Browser Migration

Browsers often have the simplest migration process:

#### Chrome Migration

```bash
# Direct import from Chrome
pwgen-cli import chrome

# Specific profile
pwgen-cli import chrome --profile "Profile 1"

# Preview first
pwgen-cli import chrome --dry-run

# Custom Chrome installation
pwgen-cli import chrome --chrome-path "/opt/google/chrome/chrome"
```

#### Firefox Migration

```bash
# Import from default profile
pwgen-cli import firefox

# Specific profile
pwgen-cli import firefox --profile "work"

# Custom Firefox directory
pwgen-cli import firefox --firefox-dir "~/snap/firefox/common/.mozilla"
```

#### Safari Migration

```bash
# macOS only - imports from Keychain
pwgen-cli import safari

# Requires permission to access Keychain
# You may be prompted for admin password
```

## Advanced Migration Scenarios

### Large Dataset Migration

For password managers with thousands of entries:

```bash
# Enable progress reporting
pwgen-cli import lastpass --file large_export.csv --show-progress

# Process in batches
split -l 1000 large_export.csv batch_
for batch in batch_*; do
    pwgen-cli import csv --file "$batch" --merge
    echo "Processed $batch"
done

# Monitor system resources
pwgen-cli import lastpass --file large_export.csv --batch-size 500
```

### Multiple Sources Migration

Combining data from multiple password managers:

```bash
# Import each source with unique tags
pwgen-cli import lastpass --file lastpass.csv --tag "from-lastpass"
pwgen-cli import bitwarden --file bitwarden.json --tag "from-bitwarden"
pwgen-cli import chrome --tag "from-chrome"

# Analyze for duplicates after all imports
pwgen-cli analyze duplicates --format table

# Clean up duplicates interactively
pwgen-cli password list --tag "from-lastpass" --format json | \
  jq -r '.[] | select(.site == "example.com") | .id' | \
  xargs -I {} pwgen-cli password delete --id {} --confirm
```

### Corporate/Team Migration

For organizations migrating team vaults:

```bash
# Create separate vaults for different teams
pwgen-cli vault create --path /shared/vaults/engineering.vault
pwgen-cli vault create --path /shared/vaults/marketing.vault

# Import team-specific data
PWGEN_VAULT_PATH="/shared/vaults/engineering.vault" \
  pwgen-cli import bitwarden --file engineering_vault.json

PWGEN_VAULT_PATH="/shared/vaults/marketing.vault" \
  pwgen-cli import bitwarden --file marketing_vault.json

# Set appropriate permissions
chmod 660 /shared/vaults/*.vault
chgrp engineering /shared/vaults/engineering.vault
chgrp marketing /shared/vaults/marketing.vault
```

## Custom CSV Import

When your source isn't directly supported, use the flexible CSV import:

### CSV Format Mapping

```bash
# Basic CSV with custom field mapping
pwgen-cli import csv --file custom.csv \
  --map-fields "Website:site,Login:username,Pass:password,Comments:notes"

# Handle special delimiters
pwgen-cli import csv --file custom.csv --delimiter "|"

# Skip header row
pwgen-cli import csv --file custom.csv --skip-header

# Handle quoted fields
pwgen-cli import csv --file custom.csv --quote-char '"'
```

### CSV Preprocessing

Sometimes you need to clean up CSV data first:

```bash
# Remove empty lines
sed '/^$/d' original.csv > cleaned.csv

# Fix encoding issues
iconv -f iso-8859-1 -t utf-8 original.csv > utf8.csv

# Add missing headers
echo "site,username,password,notes" > header.csv
cat data.csv >> header.csv

# Convert TSV to CSV
tr '\t' ',' < data.tsv > data.csv
```

## Post-Migration Tasks

### Verification and Cleanup

After importing, perform these verification steps:

```bash
# Get import statistics
echo "Total entries: $(pwgen-cli password list --format json | jq '. | length')"
echo "Entries without passwords: $(pwgen-cli password list --format json | jq '[.[] | select(.password == "")] | length')"
echo "Entries without sites: $(pwgen-cli password list --format json | jq '[.[] | select(.site == "")] | length')"

# Find potential duplicates
pwgen-cli analyze duplicates --format table

# Check for weak passwords from import
pwgen-cli analyze weak --format table

# Look for entries needing attention
pwgen-cli password list --format json | \
  jq '.[] | select(.site == "" or .username == "" or .password == "")' | \
  jq -r '"\(.id): \(.site) - \(.username)"'
```

### Data Cleanup

Clean up imported data:

```bash
# Remove test entries
pwgen-cli password delete --site "test" --confirm
pwgen-cli password search "example" --format json | \
  jq -r '.[].id' | \
  xargs -I {} pwgen-cli password delete --id {} --confirm

# Standardize site names
pwgen-cli password update --site "gmail.com" --site "Google Mail"
pwgen-cli password update --site "github.com" --site "GitHub"

# Add missing tags
pwgen-cli password list --site "*bank*" --format json | \
  jq -r '.[].id' | \
  xargs -I {} pwgen-cli password update --id {} --add-tags "banking,financial"

# Update URLs for entries missing them
pwgen-cli password list --format json | \
  jq -r '.[] | select(.url == "") | "\(.id):\(.site)"' | \
  while IFS=: read -r id site; do
    pwgen-cli password update --id "$id" --url "https://$site"
  done
```

### Security Review

Perform security analysis on imported data:

```bash
# Comprehensive security audit
echo "=== Security Review ==="
echo "Weak passwords: $(pwgen-cli analyze weak --format json | jq '. | length')"
echo "Duplicate passwords: $(pwgen-cli analyze duplicates --format json | jq '. | length')"
echo "Old passwords: $(pwgen-cli analyze old --max-age 90 --format json | jq '. | length')"

# Check for common weak passwords
pwgen-cli password list --format json | \
  jq -r '.[] | select(.password | test("password|123456|qwerty"; "i")) | "\(.site): \(.password)"'

# Generate security report
pwgen-cli analyze strength --export "post-migration-security-report.html"
```

## Troubleshooting Common Issues

### Import Failures

**Problem: Import fails with "Invalid format" error**

```bash
# Check file encoding
file -I your_export.csv

# Convert if needed
iconv -f iso-8859-1 -t utf-8 your_export.csv > fixed_export.csv

# Check for invalid characters
grep -P '[^\x00-\x7F]' your_export.csv
```

**Problem: Some entries are missing after import**

```bash
# Compare counts
echo "Lines in CSV: $(wc -l < export.csv)"
echo "Entries imported: $(pwgen-cli password list --format json | jq '. | length')"

# Check for import errors in logs
pwgen-cli import csv --file export.csv --verbose 2>&1 | grep -i error

# Look for problematic entries
awk -F, 'NF != 4 { print NR ": " $0 }' export.csv
```

### Encoding Issues

**Problem: Special characters are corrupted**

```bash
# Detect encoding
chardet your_export.csv

# Convert to UTF-8
iconv -f windows-1252 -t utf-8 your_export.csv > utf8_export.csv

# Handle different encodings
for encoding in iso-8859-1 windows-1252 utf-16; do
    if iconv -f "$encoding" -t utf-8 your_export.csv > test.csv 2>/dev/null; then
        echo "Successfully converted from $encoding"
        mv test.csv fixed_export.csv
        break
    fi
done
```

### Duplicate Handling

**Problem: Many duplicate entries after import**

```bash
# Find all duplicates
pwgen-cli analyze duplicates --format json > duplicates.json

# Remove duplicates by keeping newest
cat duplicates.json | jq -r '.[] | sort_by(.created) | .[0].id' | \
  xargs -I {} pwgen-cli password delete --id {} --confirm

# Or merge duplicates manually
pwgen-cli password list --site "example.com" --format table
# Review and decide which to keep
```

### Performance Issues

**Problem: Import is very slow**

```bash
# Import in smaller batches
split -l 1000 large_export.csv batch_
for batch in batch_*; do
    echo "Processing $batch..."
    pwgen-cli import csv --file "$batch" --merge --batch-size 100
done

# Use optimized settings
PWGEN_NON_INTERACTIVE=1 PWGEN_NO_PROGRESS=1 \
  pwgen-cli import csv --file large_export.csv
```

## Migration Scripts

### Complete Migration Script

Here's a comprehensive migration script:

```bash
#!/bin/bash
# migrate-to-pwgen.sh

set -euo pipefail

SOURCE_TYPE="$1"
SOURCE_FILE="$2"
VAULT_PATH="${3:-$HOME/.config/pwgen/vault.db}"

echo "Starting migration from $SOURCE_TYPE to PWGen-Rust"

# Create backup if vault exists
if [[ -f "$VAULT_PATH" ]]; then
    BACKUP_FILE="pre-migration-backup-$(date +%Y%m%d-%H%M%S).pwgen"
    echo "Creating backup: $BACKUP_FILE"
    PWGEN_VAULT_PATH="$VAULT_PATH" pwgen-cli backup create --output "$BACKUP_FILE"
fi

# Verify source file
if [[ ! -f "$SOURCE_FILE" ]]; then
    echo "Error: Source file $SOURCE_FILE not found"
    exit 1
fi

echo "Source file: $SOURCE_FILE ($(wc -l < "$SOURCE_FILE") lines)"

# Set vault path
export PWGEN_VAULT_PATH="$VAULT_PATH"

# Create vault if it doesn't exist
if [[ ! -f "$VAULT_PATH" ]]; then
    echo "Creating new vault: $VAULT_PATH"
    pwgen-cli vault create --path "$VAULT_PATH"
fi

# Perform import based on source type
case "$SOURCE_TYPE" in
    "lastpass")
        pwgen-cli import lastpass --file "$SOURCE_FILE" --backup-before-import
        ;;
    "bitwarden")
        pwgen-cli import bitwarden --file "$SOURCE_FILE" --backup-before-import
        ;;
    "1password")
        pwgen-cli import 1password --file "$SOURCE_FILE" --backup-before-import
        ;;
    "keepass")
        pwgen-cli import keepass --file "$SOURCE_FILE" --backup-before-import
        ;;
    "chrome")
        pwgen-cli import chrome --backup-before-import
        ;;
    "firefox")
        pwgen-cli import firefox --backup-before-import
        ;;
    "csv")
        pwgen-cli import csv --file "$SOURCE_FILE" --backup-before-import
        ;;
    *)
        echo "Error: Unsupported source type: $SOURCE_TYPE"
        echo "Supported types: lastpass, bitwarden, 1password, keepass, chrome, firefox, csv"
        exit 1
        ;;
esac

# Post-import analysis
echo "Migration completed. Running analysis..."

TOTAL=$(pwgen-cli password list --format json | jq '. | length')
WEAK=$(pwgen-cli analyze weak --format json | jq '. | length')
DUPLICATES=$(pwgen-cli analyze duplicates --format json | jq '. | length')

echo "=== Migration Summary ==="
echo "Total entries imported: $TOTAL"
echo "Weak passwords found: $WEAK"
echo "Duplicate passwords found: $DUPLICATES"

if [[ $WEAK -gt 0 ]]; then
    echo "Consider updating weak passwords:"
    pwgen-cli analyze weak --format table | head -10
fi

if [[ $DUPLICATES -gt 0 ]]; then
    echo "Consider removing duplicate passwords:"
    pwgen-cli analyze duplicates --format table | head -10
fi

# Clean up source file
read -p "Delete source file $SOURCE_FILE? [y/N]: " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    rm "$SOURCE_FILE"
    echo "Source file deleted"
fi

echo "Migration complete! Vault location: $VAULT_PATH"
```

### Batch Migration Script

For migrating multiple sources:

```bash
#!/bin/bash
# batch-migrate.sh

set -euo pipefail

SOURCES_DIR="$1"
VAULT_PATH="$2"

export PWGEN_VAULT_PATH="$VAULT_PATH"

# Create vault if needed
if [[ ! -f "$VAULT_PATH" ]]; then
    pwgen-cli vault create --path "$VAULT_PATH"
fi

# Process each export file
for file in "$SOURCES_DIR"/*.csv "$SOURCES_DIR"/*.json; do
    [[ ! -f "$file" ]] && continue
    
    filename=$(basename "$file")
    echo "Processing $filename..."
    
    # Determine type from filename
    case "$filename" in
        *lastpass*)
            pwgen-cli import lastpass --file "$file" --merge --tag "from-lastpass"
            ;;
        *bitwarden*)
            pwgen-cli import bitwarden --file "$file" --merge --tag "from-bitwarden"
            ;;
        *1password*)
            pwgen-cli import 1password --file "$file" --merge --tag "from-1password"
            ;;
        *keepass*)
            pwgen-cli import keepass --file "$file" --merge --tag "from-keepass"
            ;;
        *)
            echo "Unknown format: $filename, trying generic CSV..."
            pwgen-cli import csv --file "$file" --merge --tag "imported"
            ;;
    esac
    
    echo "Completed $filename"
done

echo "All files processed. Running final analysis..."
pwgen-cli analyze duplicates --format table
```

## Best Practices

### Security During Migration

1. **Use Secure Environment**:
   - Migrate on a secure, private computer
   - Disable cloud sync during migration
   - Use full-disk encryption
   - Close unnecessary applications

2. **Handle Export Files Securely**:
   ```bash
   # Create encrypted directory for exports
   mkdir -p ~/migration-temp
   chmod 700 ~/migration-temp
   
   # Work in temporary directory
   cd ~/migration-temp
   
   # Securely delete after migration
   shred -vfz -n 3 *.csv *.json
   cd ..
   rmdir ~/migration-temp
   ```

3. **Verify Data Integrity**:
   ```bash
   # Compare entry counts
   echo "Source entries: $(wc -l < export.csv)"
   echo "Imported entries: $(pwgen-cli password list --format json | jq '. | length')"
   
   # Spot check important entries
   pwgen-cli password search "bank" --format table
   pwgen-cli password search "email" --format table
   ```

### Performance Optimization

1. **For Large Imports**:
   ```bash
   # Use batch processing
   pwgen-cli import csv --file large-export.csv --batch-size 1000
   
   # Disable progress reporting for speed
   PWGEN_NO_PROGRESS=1 pwgen-cli import csv --file large-export.csv
   ```

2. **Memory Management**:
   ```bash
   # Monitor memory usage during import
   top -p $(pgrep pwgen-cli)
   
   # Split very large files
   split -l 5000 huge-export.csv chunk_
   ```

### Data Quality

1. **Standardize Data**:
   ```bash
   # Standardize common sites
   pwgen-cli password update --site "www.google.com" --site "google.com"
   pwgen-cli password update --site "mail.google.com" --site "gmail.com"
   
   # Add consistent tagging
   pwgen-cli password list --site "*bank*" --format json | \
     jq -r '.[].id' | \
     xargs -I {} pwgen-cli password update --id {} --add-tags "banking"
   ```

2. **Enhance Imported Data**:
   ```bash
   # Add URLs for entries missing them
   pwgen-cli password list --format json | \
     jq -r '.[] | select(.url == "") | "\(.id):\(.site)"' | \
     while IFS=: read -r id site; do
       if [[ "$site" =~ \. ]]; then
         pwgen-cli password update --id "$id" --url "https://$site"
       fi
     done
   ```

## See Also

- [CLI Commands](../cli/commands) - Import command reference
- [Getting Started](../getting-started/installation) - Initial setup
- [User Guide](../user-guide/passwords) - Managing passwords after migration
- [Security](../security/architecture) - Security considerations