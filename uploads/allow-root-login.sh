#!/bin/bash

# Script to enable root login via SSH with password authentication
# Must be run with sudo/root privileges

# Check if running with root privileges
if [ "$EUID" -ne 0 ]; then
    echo "Error: This script must be run with root privileges (sudo)"
    exit 1
fi

echo "========================================="
echo "  Enable Root SSH Password Login Setup"
echo "========================================="
echo ""

# Step 1: Set root password
echo "Step 1: Setting root user password"
echo "-----------------------------------"
echo "Please enter the new password for the root user:"
passwd root

if [ $? -ne 0 ]; then
    echo "Error: Failed to set root password"
    exit 1
fi

echo ""
echo "Root password set successfully!"
echo ""

# Step 2: Configure SSHD to allow root login with password
echo "Step 2: Configuring SSH for root password login"
echo "------------------------------------------------"

SSHD_CONFIG="/etc/ssh/sshd_config"
SSHD_CONFIG_DIR="/etc/ssh/sshd_config.d"

# Function to update SSH config file
update_ssh_config() {
    local config_file="$1"
    local modified=false
    
    if [ ! -f "$config_file" ]; then
        return 1
    fi
    
    # Check and update PermitRootLogin
    if grep -q "^PermitRootLogin" "$config_file"; then
        if ! grep -q "^PermitRootLogin yes" "$config_file"; then
            sed -i 's/^PermitRootLogin.*/PermitRootLogin yes/' "$config_file"
            echo "  ✓ Updated PermitRootLogin in: $config_file"
            modified=true
        fi
    elif grep -q "^#PermitRootLogin" "$config_file"; then
        sed -i 's/^#PermitRootLogin.*/PermitRootLogin yes/' "$config_file"
        echo "  ✓ Enabled PermitRootLogin in: $config_file"
        modified=true
    fi
    
    # Check and update PasswordAuthentication
    if grep -q "^PasswordAuthentication" "$config_file"; then
        if ! grep -q "^PasswordAuthentication yes" "$config_file"; then
            sed -i 's/^PasswordAuthentication.*/PasswordAuthentication yes/' "$config_file"
            echo "  ✓ Updated PasswordAuthentication in: $config_file"
            modified=true
        fi
    elif grep -q "^#PasswordAuthentication" "$config_file"; then
        sed -i 's/^#PasswordAuthentication.*/PasswordAuthentication yes/' "$config_file"
        echo "  ✓ Enabled PasswordAuthentication in: $config_file"
        modified=true
    fi
    
    if [ "$modified" = true ]; then
        return 0
    fi
    return 1
}

# Backup the original sshd_config
if [ ! -f "${SSHD_CONFIG}.backup" ]; then
    cp "$SSHD_CONFIG" "${SSHD_CONFIG}.backup"
    echo "Backup created: ${SSHD_CONFIG}.backup"
fi

echo ""
echo "Checking main config: $SSHD_CONFIG"
echo "-----------------------------------"

# Update main sshd_config
update_ssh_config "$SSHD_CONFIG"

# Ensure settings exist in main config if not found anywhere
if ! grep -q "^PermitRootLogin" "$SSHD_CONFIG"; then
    echo "PermitRootLogin yes" >> "$SSHD_CONFIG"
    echo "  ✓ Added PermitRootLogin yes to: $SSHD_CONFIG"
fi

if ! grep -q "^PasswordAuthentication" "$SSHD_CONFIG"; then
    echo "PasswordAuthentication yes" >> "$SSHD_CONFIG"
    echo "  ✓ Added PasswordAuthentication yes to: $SSHD_CONFIG"
fi

# Step 3: Check and update conf.d directory files
echo ""
echo "Checking drop-in config directory..."
echo "-------------------------------------"

if [ -d "$SSHD_CONFIG_DIR" ]; then
    echo "Found config directory: $SSHD_CONFIG_DIR"
    
    # Find all .conf files in the directory
    config_files=$(find "$SSHD_CONFIG_DIR" -name "*.conf" -type f 2>/dev/null)
    
    if [ -n "$config_files" ]; then
        for config_file in $config_files; do
            # Check if file contains any blocking settings
            if grep -qE "(PermitRootLogin|PasswordAuthentication)" "$config_file"; then
                echo ""
                echo "Found SSH settings in: $config_file"
                
                # Create backup if not exists
                if [ ! -f "${config_file}.backup" ]; then
                    cp "$config_file" "${config_file}.backup"
                fi
                
                update_ssh_config "$config_file"
            fi
        done
    else
        echo "  No .conf files found in $SSHD_CONFIG_DIR"
    fi
    
    # Check if cloud-init might reset on reboot
    if ls "$SSHD_CONFIG_DIR"/*cloud* 2>/dev/null | grep -q .; then
        echo ""
        echo "⚠️  Cloud-init config detected! SSH settings may reset on reboot."
        echo "   Consider disabling SSH management in cloud-init."
    fi
else
    echo "  No drop-in directory found at $SSHD_CONFIG_DIR"
fi

# Step 4: Validate configuration before restart
echo ""
echo "Step 4: Validating SSH configuration..."
echo "----------------------------------------"

if command -v sshd &> /dev/null; then
    sshd -t 2>&1
    if [ $? -ne 0 ]; then
        echo "Error: SSH configuration has errors!"
        echo "Restoring backup..."
        cp "${SSHD_CONFIG}.backup" "$SSHD_CONFIG"
        exit 1
    fi
    echo "✓ SSH configuration is valid"
fi

# Step 5: Restart SSH service
echo ""
echo "Step 5: Restarting SSH service..."
echo "----------------------------------"

# Detect init system and restart accordingly
if command -v systemctl &> /dev/null; then
    systemctl restart sshd 2>/dev/null || systemctl restart ssh 2>/dev/null
elif command -v service &> /dev/null; then
    service sshd restart 2>/dev/null || service ssh restart 2>/dev/null
else
    /etc/init.d/sshd restart 2>/dev/null || /etc/init.d/ssh restart 2>/dev/null
fi

if [ $? -eq 0 ]; then
    echo "✓ SSH service restarted successfully"
else
    echo "Warning: Could not restart SSH service automatically."
    echo "Please restart it manually with: systemctl restart sshd"
fi

# Step 6: Verify settings are active
echo ""
echo "Step 6: Verifying active settings..."
echo "-------------------------------------"

if command -v sshd &> /dev/null; then
    # Check effective configuration
    permit_root=$(sshd -T 2>/dev/null | grep -i "permitrootlogin" | awk '{print $2}')
    password_auth=$(sshd -T 2>/dev/null | grep -i "passwordauthentication" | awk '{print $2}')
    
    echo "Effective PermitRootLogin: ${permit_root:-unknown}"
    echo "Effective PasswordAuthentication: ${password_auth:-unknown}"
    
    if [ "$permit_root" != "yes" ] || [ "$password_auth" != "yes" ]; then
        echo ""
        echo "⚠️  WARNING: Settings may not be fully applied!"
        echo "   There might be additional override files."
        echo "   Check manually: sshd -T | grep -E '(permitrootlogin|passwordauthentication)'"
    fi
fi

echo ""
echo "========================================="
echo "  Setup Complete!"
echo "========================================="
echo ""
echo "Root user can now login via SSH using password."
echo ""
echo "⚠️  SECURITY WARNING:"
echo "   Enabling root password login is a security risk."
echo "   Consider using SSH key authentication instead."
echo ""
echo "Backups created with .backup extension"
echo "========================================="
