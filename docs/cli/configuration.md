---
sidebar_position: 3
---

# CLI Configuration

Comprehensive guide to configuring PWGen-Rust CLI for optimal workflow and security.

## Configuration Overview

PWGen-Rust CLI uses a hierarchical configuration system that prioritizes settings in this order:

1. **Command-line flags** (highest priority)
2. **Environment variables**
3. **Configuration file**
4. **Built-in defaults** (lowest priority)

This allows you to set global defaults while overriding specific options as needed.

## Configuration File

### Default Location

The configuration file is automatically created at:

- **Linux/macOS**: `~/.config/pwgen/config.toml`
- **Windows**: `%APPDATA%\pwgen\config.toml`

### Custom Location

You can specify a custom configuration file:

```bash
# Using environment variable
export PWGEN_CONFIG_PATH="/path/to/custom/config.toml"

# Or using command-line flag
pwgen-cli --config /path/to/custom/config.toml password list
```

### Configuration Format

The configuration file uses TOML format for easy reading and editing:

```toml
# ~/.config/pwgen/config.toml

[general]
default_vault = "~/.config/pwgen/vault.db"
auto_lock_minutes = 15
confirm_destructive = true

[cli]
default_format = "table"
editor = "vim"
pager = "less"
max_results = 100

[output]
colors = true
unicode = true
timestamp_format = "%Y-%m-%d %H:%M:%S"
date_format = "%Y-%m-%d"

[clipboard]
clear_after_seconds = 30
use_primary_selection = false
notification = true

[security]
require_master_password = true
session_timeout_minutes = 30
password_visibility_timeout = 5
audit_log = true

[generator]
default_length = 16
include_symbols = true
include_numbers = true
include_uppercase = true
include_lowercase = true
exclude_ambiguous = false

[import]
default_merge_strategy = "skip"
backup_before_import = true
validate_imports = true

[backup]
default_compression = 6
include_metadata = true
verify_after_create = true
```

## Configuration Sections

### General Settings

Controls core application behavior:

```toml
[general]
# Default vault location
default_vault = "~/.config/pwgen/vault.db"

# Auto-lock vault after inactivity (minutes)
auto_lock_minutes = 15

# Require confirmation for destructive operations
confirm_destructive = true

# Enable debug logging
debug = false

# Log file location (empty disables file logging)
log_file = "~/.config/pwgen/cli.log"

# Maximum log file size in MB
max_log_size = 10
```

### CLI Settings

Customizes command-line interface behavior:

```toml
[cli]
# Default output format: text, json, csv, table
default_format = "table"

# External editor for interactive editing
editor = "vim"

# Pager for long output
pager = "less"

# Maximum number of results to display
max_results = 100

# Show progress bars for long operations
show_progress = true

# Disable interactive prompts (for scripting)
non_interactive = false

# Command history file
history_file = "~/.config/pwgen/history"

# Maximum history entries
max_history = 1000
```

### Output Settings

Controls how information is displayed:

```toml
[output]
# Enable colored output
colors = true

# Use Unicode characters for tables and icons
unicode = true

# Timestamp format for display
timestamp_format = "%Y-%m-%d %H:%M:%S"

# Date format for display
date_format = "%Y-%m-%d"

# Show relative times (e.g., "2 days ago")
relative_times = true

# Truncate long values in table format
truncate_values = true

# Maximum width for truncated values
max_value_width = 30

# Table style: ascii, unicode, minimal
table_style = "unicode"
```

### Clipboard Settings

Manages clipboard operations:

```toml
[clipboard]
# Auto-clear clipboard after specified seconds
clear_after_seconds = 30

# Use primary selection (Linux/Unix X11)
use_primary_selection = false

# Show desktop notification when copying
notification = true

# Notification timeout in seconds
notification_timeout = 3

# Clear clipboard on application exit
clear_on_exit = true
```

### Security Settings

Enhances security behavior:

```toml
[security]
# Always require master password confirmation
require_master_password = true

# Session timeout in minutes
session_timeout_minutes = 30

# Hide password after specified seconds when displayed
password_visibility_timeout = 5

# Enable audit logging
audit_log = true

# Audit log file location
audit_log_file = "~/.config/pwgen/audit.log"

# Require 2FA for sensitive operations (if configured)
require_2fa = false

# Lock vault on system suspend/hibernate
lock_on_suspend = true

# Disable memory swapping for sensitive data
disable_swap = true
```

### Generator Settings

Default password generation options:

```toml
[generator]
# Default password length
default_length = 16

# Include symbols by default
include_symbols = true

# Include numbers by default
include_numbers = true

# Include uppercase letters by default
include_uppercase = true

# Include lowercase letters by default
include_lowercase = true

# Exclude ambiguous characters (0, O, l, 1, etc.)
exclude_ambiguous = false

# Custom character sets
custom_symbols = "!@#$%^&*"
custom_numbers = "0123456789"
custom_lowercase = "abcdefghijklmnopqrstuvwxyz"
custom_uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

# Minimum character requirements
min_symbols = 1
min_numbers = 1
min_uppercase = 1
min_lowercase = 1
```

### Import Settings

Controls import behavior:

```toml
[import]
# Default merge strategy: skip, overwrite, merge
default_merge_strategy = "skip"

# Create backup before importing
backup_before_import = true

# Validate imported data
validate_imports = true

# Show import preview before applying
preview_imports = true

# Maximum import batch size
max_batch_size = 1000

# Import timeout in seconds
import_timeout = 300
```

### Backup Settings

Configures backup operations:

```toml
[backup]
# Default compression level (0-9)
default_compression = 6

# Include metadata in backups
include_metadata = true

# Verify backup integrity after creation
verify_after_create = true

# Default backup directory
backup_directory = "~/.config/pwgen/backups"

# Maximum number of automatic backups to keep
max_auto_backups = 10

# Automatic backup interval in days
auto_backup_days = 7
```

## Environment Variables

Environment variables override configuration file settings:

### Core Variables

```bash
# Vault location
export PWGEN_VAULT_PATH="/path/to/vault.db"

# Configuration file location
export PWGEN_CONFIG_PATH="/path/to/config.toml"

# Output format
export PWGEN_FORMAT="json"

# Disable colored output
export PWGEN_NO_COLOR=1

# Non-interactive mode
export PWGEN_NON_INTERACTIVE=1

# Debug mode
export PWGEN_DEBUG=1

# Log file location
export PWGEN_LOG_FILE="/path/to/logfile.log"
```

### Editor and Pager

```bash
# External editor (overrides config file)
export PWGEN_EDITOR="nano"
export EDITOR="nano"  # Fallback

# Pager for long output
export PWGEN_PAGER="bat"
export PAGER="less"  # Fallback
```

### Security Variables

```bash
# Session timeout in minutes
export PWGEN_SESSION_TIMEOUT=30

# Clipboard clear timeout in seconds
export PWGEN_CLIPBOARD_TIMEOUT=60

# Disable audit logging
export PWGEN_NO_AUDIT=1

# Force master password prompt
export PWGEN_REQUIRE_PASSWORD=1
```

### Import/Export Variables

```bash
# Default import strategy
export PWGEN_IMPORT_STRATEGY="merge"

# Backup before import
export PWGEN_BACKUP_BEFORE_IMPORT=1

# Default export format
export PWGEN_EXPORT_FORMAT="csv"
```

## Platform-Specific Configuration

### Linux Configuration

```toml
[platform.linux]
# Use native keyring integration
use_keyring = true

# Keyring service name
keyring_service = "pwgen-rust"

# X11 clipboard integration
x11_clipboard = true

# Wayland clipboard integration
wayland_clipboard = true

# Desktop notifications via D-Bus
desktop_notifications = true
```

### macOS Configuration

```toml
[platform.macos]
# Use macOS Keychain integration
use_keychain = true

# Keychain service name
keychain_service = "dev.pwgenrust.cli"

# Use Touch ID for authentication
use_touchid = true

# Secure Enclave integration
use_secure_enclave = true

# macOS notification center
notification_center = true
```

### Windows Configuration

```toml
[platform.windows]
# Use Windows Credential Manager
use_credential_manager = true

# Credential target name
credential_target = "pwgen-rust-cli"

# Windows notification system
windows_notifications = true

# Windows Hello integration
use_windows_hello = true
```

## Advanced Configuration

### Custom Commands

Define aliases for common operations:

```toml
[aliases]
# Shorthand commands
ls = "password list"
find = "password search"
gen = "generate"
cp = "password copy"
rm = "password delete"

# Complex aliases with parameters
backup-daily = "backup create --output ~/backups/daily-$(date +%Y%m%d).pwgen"
audit = "analyze weak && analyze duplicates && analyze old --max-age 90"
```

### Format Templates

Customize output formats:

```toml
[templates]
# Custom table format
password_table = "{{ id | pad(3) }} | {{ site | truncate(20) }} | {{ username | truncate(15) }} | {{ tags | join(',') }}"

# Custom JSON format
password_json = '''
{
  "id": {{ id }},
  "site": "{{ site }}",
  "username": "{{ username }}",
  "created": "{{ created | date('%Y-%m-%d') }}",
  "tags": [{{ tags | map(quote) | join(',') }}]
}
'''
```

### Plugin Configuration

Configure external integrations:

```toml
[plugins]
# 1Password CLI integration
onepassword_cli = "/usr/local/bin/op"

# Bitwarden CLI integration
bitwarden_cli = "/usr/local/bin/bw"

# Custom password strength checker
strength_checker = "/usr/local/bin/zxcvbn"

# External breach checker
breach_checker = "https://api.pwnedpasswords.com/range/"
```

## Configuration Validation

### Validate Configuration

Check your configuration file for errors:

```bash
# Validate configuration file
pwgen-cli config validate

# Show current configuration
pwgen-cli config show

# Show configuration with sources
pwgen-cli config show --verbose

# Test specific setting
pwgen-cli config test clipboard.clear_after_seconds
```

### Configuration Errors

Common configuration issues and solutions:

```bash
# Invalid TOML syntax
pwgen-cli config validate
# Error: Invalid TOML at line 15: expected '=' after key

# Invalid value type
pwgen-cli config validate
# Error: security.session_timeout_minutes must be a number

# Missing required value
pwgen-cli config validate
# Error: general.default_vault path does not exist
```

## Best Practices

### Security Best Practices

1. **Protect Configuration Files**:
   ```bash
   # Set restrictive permissions
   chmod 600 ~/.config/pwgen/config.toml
   chmod 700 ~/.config/pwgen/
   ```

2. **Sensitive Values**:
   ```bash
   # Use environment variables for sensitive settings
   export PWGEN_VAULT_PATH="/secure/location/vault.db"
   # Don't put vault passwords in config files
   ```

3. **Audit Configuration**:
   ```bash
   # Regularly review settings
   pwgen-cli config show | grep -E "(log|audit|timeout)"
   ```

### Performance Optimization

1. **Large Vaults**:
   ```toml
   [cli]
   max_results = 50  # Limit results for faster display
   
   [output]
   truncate_values = true  # Truncate long values
   ```

2. **Frequent Operations**:
   ```toml
   [general]
   auto_lock_minutes = 60  # Reduce lock frequency
   
   [clipboard]
   clear_after_seconds = 60  # Longer clipboard timeout
   ```

### Workflow Optimization

1. **Daily Use**:
   ```toml
   [cli]
   default_format = "table"  # Easy to read
   show_progress = true      # Visual feedback
   
   [aliases]
   work = "password list --tag work"
   personal = "password list --tag personal"
   ```

2. **Scripting**:
   ```toml
   [cli]
   non_interactive = true    # No prompts
   default_format = "json"   # Machine readable
   
   [output]
   colors = false           # Clean output
   ```

## Configuration Examples

### Minimal Configuration

Basic setup for new users:

```toml
[general]
default_vault = "~/pwgen-vault.db"
auto_lock_minutes = 30

[cli]
default_format = "table"

[clipboard]
clear_after_seconds = 45
```

### Power User Configuration

Advanced setup with all features:

```toml
[general]
default_vault = "~/Documents/Security/pwgen.vault"
auto_lock_minutes = 10
confirm_destructive = true
debug = false
log_file = "~/.local/share/pwgen/cli.log"

[cli]
default_format = "table"
editor = "nvim"
pager = "bat"
max_results = 50
show_progress = true
history_file = "~/.local/share/pwgen/history"

[output]
colors = true
unicode = true
timestamp_format = "%Y-%m-%d %H:%M"
relative_times = true
table_style = "unicode"

[clipboard]
clear_after_seconds = 30
notification = true
clear_on_exit = true

[security]
session_timeout_minutes = 15
password_visibility_timeout = 3
audit_log = true
lock_on_suspend = true

[generator]
default_length = 20
exclude_ambiguous = true
min_symbols = 2
min_numbers = 2

[aliases]
ls = "password list"
find = "password search"
daily-backup = "backup create --output ~/Backups/pwgen-$(date +%Y%m%d).pwgen"
security-check = "analyze weak && analyze duplicates"
```

### Team Configuration

Shared settings for team environments:

```toml
[general]
confirm_destructive = true
log_file = "/var/log/pwgen/team.log"

[cli]
default_format = "json"
non_interactive = true
max_results = 1000

[security]
audit_log = true
audit_log_file = "/var/log/pwgen/audit.log"
require_master_password = true

[backup]
backup_directory = "/shared/backups/pwgen"
auto_backup_days = 1
verify_after_create = true

[import]
backup_before_import = true
preview_imports = true
```

## Troubleshooting

### Common Issues

1. **Configuration Not Loading**:
   ```bash
   # Check file location
   pwgen-cli config show --verbose
   
   # Verify file permissions
   ls -la ~/.config/pwgen/config.toml
   ```

2. **Environment Variable Conflicts**:
   ```bash
   # Show all PWGen environment variables
   env | grep PWGEN
   
   # Clear conflicting variables
   unset PWGEN_FORMAT
   ```

3. **Invalid Settings**:
   ```bash
   # Validate configuration
   pwgen-cli config validate
   
   # Reset to defaults
   pwgen-cli config reset
   ```

### Debug Mode

Enable detailed logging for troubleshooting:

```bash
# Enable debug mode
export PWGEN_DEBUG=1
pwgen-cli password list

# Or in config file
[general]
debug = true
log_file = "~/.config/pwgen/debug.log"
```

## See Also

- [CLI Overview](overview) - Introduction to CLI usage
- [Commands Reference](commands) - Complete command documentation
- [User Guide](../user-guide/configuration) - GUI configuration
- [Security](../security/architecture) - Security implementation details