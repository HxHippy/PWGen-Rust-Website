---
sidebar_position: 2
---

# CLI Commands Reference

Complete reference for all PWGen-Rust CLI commands and options.

## Global Options

These options work with all commands:

```bash
pwgen-cli [GLOBAL_OPTIONS] <COMMAND> [COMMAND_OPTIONS]
```

### Global Flags

| Option | Description |
|--------|-------------|
| `--vault <PATH>` | Specify vault file location |
| `--format <FORMAT>` | Output format: `text`, `json`, `csv`, `table` |
| `--verbose, -v` | Enable verbose output |
| `--quiet, -q` | Suppress non-error output |
| `--help, -h` | Show help information |
| `--version, -V` | Show version information |
| `--no-color` | Disable colored output |

### Examples

```bash
# Use custom vault location
pwgen-cli --vault ~/work-vault.db password list

# Get JSON output
pwgen-cli --format json password search "github"

# Verbose mode for debugging
pwgen-cli --verbose vault create --path new-vault.db
```

## Vault Commands

### `vault create`

Create a new vault with master password.

```bash
pwgen-cli vault create [OPTIONS]
```

**Options:**
- `--path <PATH>` - Vault file location (required)
- `--force` - Overwrite existing vault

**Examples:**
```bash
# Create new vault
pwgen-cli vault create --path ~/my-vault.db

# Overwrite existing vault
pwgen-cli vault create --path existing.db --force
```

### `vault status`

Show vault information and status.

```bash
pwgen-cli vault status
```

**Output includes:**
- Vault file location
- Lock status
- Entry count
- Last modified date

### `vault lock`

Lock the vault, requiring password for next access.

```bash
pwgen-cli vault lock
```

### `vault unlock`

Unlock the vault with master password.

```bash
pwgen-cli vault unlock
```

### `vault change-password`

Change the master password.

```bash
pwgen-cli vault change-password
```

## Password Commands

### `password add`

Add a new password entry to the vault.

```bash
pwgen-cli password add [OPTIONS]
```

**Options:**
- `--site <SITE>` - Website or service name (required)
- `--username <USERNAME>` - Username or email (required)
- `--password <PASSWORD>` - Password (prompted if not provided)
- `--tags <TAGS>` - Comma-separated tags
- `--notes <NOTES>` - Additional notes
- `--url <URL>` - Full URL for the service

**Examples:**
```bash
# Add entry with prompted password
pwgen-cli password add --site github.com --username user@example.com

# Add with all details
pwgen-cli password add \
  --site "My Bank" \
  --username "customer123" \
  --password "secure-password" \
  --tags "banking,financial" \
  --notes "Main checking account" \
  --url "https://bank.example.com/login"
```

### `password list`

List all password entries.

```bash
pwgen-cli password list [OPTIONS]
```

**Options:**
- `--tag <TAG>` - Filter by tag
- `--site <PATTERN>` - Filter by site pattern
- `--username <PATTERN>` - Filter by username pattern
- `--older-than <DURATION>` - Show entries older than duration
- `--newer-than <DURATION>` - Show entries newer than duration
- `--limit <NUMBER>` - Limit number of results

**Examples:**
```bash
# List all entries
pwgen-cli password list

# Filter by tag
pwgen-cli password list --tag work

# Find old passwords
pwgen-cli password list --older-than "90 days"

# Search by site pattern
pwgen-cli password list --site "*google*"
```

### `password search`

Search password entries by keyword.

```bash
pwgen-cli password search <QUERY> [OPTIONS]
```

**Options:**
- `--case-sensitive` - Enable case-sensitive search
- `--limit <NUMBER>` - Limit number of results

**Examples:**
```bash
# Basic search
pwgen-cli password search "github"

# Case-sensitive search
pwgen-cli password search "GitHub" --case-sensitive

# Limit results
pwgen-cli password search "email" --limit 5
```

### `password update`

Update an existing password entry.

```bash
pwgen-cli password update [OPTIONS]
```

**Options:**
- `--site <SITE>` - Site to update (required)
- `--username <USERNAME>` - New username
- `--password <PASSWORD>` - New password
- `--tags <TAGS>` - New tags (replaces existing)
- `--add-tags <TAGS>` - Add tags to existing
- `--remove-tags <TAGS>` - Remove specific tags
- `--notes <NOTES>` - New notes
- `--url <URL>` - New URL

**Examples:**
```bash
# Update password only
pwgen-cli password update --site github.com --password "new-password"

# Update multiple fields
pwgen-cli password update \
  --site github.com \
  --username "new-email@example.com" \
  --add-tags "2fa-enabled"
```

### `password delete`

Delete a password entry.

```bash
pwgen-cli password delete [OPTIONS]
```

**Options:**
- `--site <SITE>` - Site to delete (required)
- `--confirm` - Skip confirmation prompt
- `--tag <TAG>` - Delete all entries with tag

**Examples:**
```bash
# Delete specific entry
pwgen-cli password delete --site github.com

# Delete without confirmation
pwgen-cli password delete --site old-service.com --confirm

# Delete all entries with tag
pwgen-cli password delete --tag "old" --confirm
```

### `password copy`

Copy password to clipboard.

```bash
pwgen-cli password copy [OPTIONS]
```

**Options:**
- `--site <SITE>` - Site to copy from (required)
- `--username` - Copy username instead of password
- `--clear-after <SECONDS>` - Auto-clear clipboard (default: 30)

**Examples:**
```bash
# Copy password
pwgen-cli password copy --site github.com

# Copy username
pwgen-cli password copy --site github.com --username

# Custom clear time
pwgen-cli password copy --site github.com --clear-after 60
```

## Secret Commands

### `secret add`

Add various types of secrets (API keys, SSH keys, documents).

```bash
pwgen-cli secret add <TYPE> [OPTIONS]
```

**Types:**
- `api-key` - API keys and tokens
- `ssh-key` - SSH private keys
- `document` - Files and certificates
- `note` - Secure text notes

**API Key Options:**
- `--name <NAME>` - Secret name (required)
- `--value <VALUE>` - API key value
- `--provider <PROVIDER>` - Service provider
- `--tags <TAGS>` - Tags

**SSH Key Options:**
- `--name <NAME>` - Key name (required)
- `--key-file <FILE>` - Path to private key file
- `--tags <TAGS>` - Tags

**Document Options:**
- `--title <TITLE>` - Document title (required)
- `--file <FILE>` - Path to file
- `--tags <TAGS>` - Tags

**Examples:**
```bash
# Add API key
pwgen-cli secret add api-key \
  --name "GitHub Token" \
  --provider "GitHub" \
  --tags "development,github"

# Add SSH key
pwgen-cli secret add ssh-key \
  --name "Production Server" \
  --key-file ~/.ssh/prod_key \
  --tags "server,production"

# Add document
pwgen-cli secret add document \
  --title "SSL Certificate" \
  --file ~/certs/ssl.pem \
  --tags "certificate,ssl"
```

### `secret list`

List all secrets.

```bash
pwgen-cli secret list [OPTIONS]
```

**Options:**
- `--type <TYPE>` - Filter by secret type
- `--tag <TAG>` - Filter by tag
- `--name <PATTERN>` - Filter by name pattern

### `secret copy`

Copy secret value to clipboard.

```bash
pwgen-cli secret copy --name <NAME> [OPTIONS]
```

**Options:**
- `--clear-after <SECONDS>` - Auto-clear clipboard

### `secret delete`

Delete a secret.

```bash
pwgen-cli secret delete --name <NAME> [OPTIONS]
```

**Options:**
- `--confirm` - Skip confirmation prompt

## Generator Commands

### `generate`

Generate secure passwords with customizable options.

```bash
pwgen-cli generate [OPTIONS]
```

**Options:**
- `--length <LENGTH>` - Password length (default: 16)
- `--count <COUNT>` - Number of passwords to generate
- `--symbols` - Include symbols
- `--no-symbols` - Exclude symbols
- `--numbers` - Include numbers
- `--no-numbers` - Exclude numbers
- `--uppercase` - Include uppercase letters
- `--no-uppercase` - Exclude uppercase letters
- `--lowercase` - Include lowercase letters
- `--no-lowercase` - Exclude lowercase letters
- `--no-ambiguous` - Exclude ambiguous characters (0, O, l, 1)
- `--pattern <PATTERN>` - Use custom pattern
- `--copy` - Copy generated password to clipboard

**Pattern Syntax:**
- `L` - Uppercase letter
- `l` - Lowercase letter
- `d` - Digit
- `s` - Symbol
- Any other character is used literally

**Examples:**
```bash
# Basic generation
pwgen-cli generate

# Custom length with symbols
pwgen-cli generate --length 24 --symbols

# Multiple passwords
pwgen-cli generate --count 5 --length 12

# Pattern-based generation
pwgen-cli generate --pattern "Llll-dddd-LLLL"

# No ambiguous characters
pwgen-cli generate --length 20 --no-ambiguous

# Generate and copy
pwgen-cli generate --length 16 --symbols --copy
```

## Import Commands

### `import`

Import passwords from various sources.

```bash
pwgen-cli import <SOURCE> [OPTIONS]
```

**Sources:**
- `csv` - Generic CSV file
- `chrome` - Chrome browser
- `firefox` - Firefox browser
- `edge` - Microsoft Edge
- `safari` - Safari browser
- `opera` - Opera browser
- `brave` - Brave browser
- `lastpass` - LastPass export
- `bitwarden` - Bitwarden export
- `1password` - 1Password export
- `keepass` - KeePass export

**Options:**
- `--file <FILE>` - Import file path (for file-based imports)
- `--profile <PROFILE>` - Browser profile name
- `--merge` - Merge with existing entries (don't overwrite)
- `--dry-run` - Show what would be imported without actually importing

**Examples:**
```bash
# Import from Chrome
pwgen-cli import chrome

# Import from specific Firefox profile
pwgen-cli import firefox --profile "work"

# Import from CSV file
pwgen-cli import csv --file passwords.csv

# Import from LastPass export
pwgen-cli import lastpass --file lastpass_export.csv

# Dry run to preview import
pwgen-cli import chrome --dry-run
```

## Export Commands

### `export`

Export vault data to various formats.

```bash
pwgen-cli export <FORMAT> [OPTIONS]
```

**Formats:**
- `csv` - Comma-separated values
- `json` - JSON format
- `html` - HTML report
- `xml` - XML format

**Options:**
- `--output <FILE>` - Output file path
- `--include-passwords` - Include passwords in export (security warning)
- `--tag <TAG>` - Export only entries with specific tag
- `--template <TEMPLATE>` - Use custom export template

**Examples:**
```bash
# Export to CSV (passwords excluded by default)
pwgen-cli export csv --output vault-export.csv

# Export to JSON with passwords
pwgen-cli export json --output vault-backup.json --include-passwords

# Export specific tag
pwgen-cli export csv --output work-passwords.csv --tag work

# Export to HTML report
pwgen-cli export html --output vault-report.html
```

## Backup Commands

### `backup create`

Create encrypted backup of the vault.

```bash
pwgen-cli backup create [OPTIONS]
```

**Options:**
- `--output <FILE>` - Backup file location (required)
- `--compression <LEVEL>` - Compression level (0-9, default: 6)
- `--password <PASSWORD>` - Backup encryption password (prompted if not provided)

**Examples:**
```bash
# Create basic backup
pwgen-cli backup create --output vault-backup.pwgen

# Create compressed backup
pwgen-cli backup create --output vault-backup.pwgen --compression 9

# Create backup with custom password
pwgen-cli backup create --output vault-backup.pwgen --password "backup-password"
```

### `backup verify`

Verify backup file integrity.

```bash
pwgen-cli backup verify --file <FILE>
```

### `backup list`

List contents of backup file without restoring.

```bash
pwgen-cli backup list --file <FILE>
```

### `restore`

Restore vault from backup file.

```bash
pwgen-cli restore --file <FILE> [OPTIONS]
```

**Options:**
- `--output <PATH>` - Restored vault location
- `--merge` - Merge with existing vault
- `--force` - Overwrite existing vault

## Analysis Commands

### `analyze`

Analyze vault security and password strength.

```bash
pwgen-cli analyze <TYPE> [OPTIONS]
```

**Analysis Types:**
- `weak` - Find weak passwords
- `duplicates` - Find duplicate passwords
- `old` - Find old passwords
- `breached` - Check against known breaches (requires internet)
- `strength` - Overall password strength report

**Options:**
- `--min-strength <LEVEL>` - Minimum strength threshold (1-5)
- `--max-age <DAYS>` - Maximum password age in days
- `--export <FILE>` - Export analysis results

**Examples:**
```bash
# Find weak passwords
pwgen-cli analyze weak

# Find duplicates
pwgen-cli analyze duplicates --format table

# Find old passwords
pwgen-cli analyze old --max-age 90

# Check for breached passwords
pwgen-cli analyze breached

# Generate strength report
pwgen-cli analyze strength --export security-report.html
```

## Completion Commands

### `completion`

Generate shell completion scripts.

```bash
pwgen-cli completion <SHELL>
```

**Supported Shells:**
- `bash`
- `zsh`
- `fish`
- `powershell`

**Examples:**
```bash
# Generate Bash completion
pwgen-cli completion bash > ~/.bash_completion.d/pwgen-cli

# Generate Zsh completion
pwgen-cli completion zsh > ~/.zsh/completions/_pwgen-cli

# Generate Fish completion
pwgen-cli completion fish > ~/.config/fish/completions/pwgen-cli.fish
```

## Exit Codes

| Code | Description |
|------|-------------|
| 0 | Success |
| 1 | General error |
| 2 | Command not found |
| 3 | Invalid arguments |
| 4 | Vault not found or locked |
| 5 | Entry not found |
| 6 | Authentication failed |
| 7 | Permission denied |
| 8 | Import/export error |
| 9 | Network error |

## Common Usage Patterns

### Daily Workflow

```bash
# Morning routine
pwgen-cli vault unlock
pwgen-cli password list --tag work

# Add new password
pwgen-cli password add --site new-service.com --username user@company.com

# Copy password when needed
pwgen-cli password copy --site github.com

# End of day
pwgen-cli vault lock
```

### Security Maintenance

```bash
# Weekly security check
pwgen-cli analyze weak
pwgen-cli analyze duplicates
pwgen-cli analyze old --max-age 90

# Monthly backup
pwgen-cli backup create --output "monthly-backup-$(date +%Y%m).pwgen"

# Quarterly breach check
pwgen-cli analyze breached
```

### Bulk Operations

```bash
# Update tags for multiple entries
pwgen-cli password list --tag "old-work" --format json | \
  jq -r '.[].site' | \
  xargs -I {} pwgen-cli password update --site {} --remove-tags "old-work" --add-tags "archived"

# Generate passwords for multiple services
echo "service1.com service2.com service3.com" | \
  tr ' ' '\n' | \
  xargs -I {} pwgen-cli password add --site {} --username admin --password "$(pwgen-cli generate --length 16)"
```

## See Also

- [CLI Overview](overview) - Introduction and basic concepts
- [Configuration](configuration) - Advanced configuration options
- [User Guide](../user-guide/passwords) - GUI and CLI integration
- [Security](../security/architecture) - Security implementation details