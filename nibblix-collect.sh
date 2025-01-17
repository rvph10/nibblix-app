#!/bin/bash

# Define help function
show_help() {
    echo "Usage: nibblix-collector [OPTIONS]"
    echo "Collects and saves content of relevant files in the current directory."
    echo
    echo "Options:"
    echo "  -h, --help                 Show this help message"
    echo "  -e, --exclude PATTERN      Additional directories to exclude (comma-separated)"
    echo "  -f, --exclude-file FILE    Files to exclude (comma-separated)"
    echo "  -i, --include PATTERN      Additional file patterns to include (comma-separated)"
    echo "  -m, --max-size SIZE        Maximum file size in KB (default: 1000)"
    echo "  -v, --verbose              Show more detailed output"
}

# Default values
VERBOSE=false
MAX_SIZE=1000 # KB
CURRENT_DATE=$(date +"%d-%m")
OUTPUT_DIR="$HOME/nibblix/output/$CURRENT_DATE"
TEMP_FILE="/tmp/nibblix_files_$RANDOM.txt"

# Default excluded directories
EXCLUDED_DIRS=(
    "node_modules"
    ".git"
    ".next"
    "dist"
    "build"
    "coverage"
    "docs"
    "output"
    "public"
    ".github"
)

# Default excluded files
EXCLUDED_FILES=(
    "package-lock.json"
    "README.md"
    "nibblix-collect.sh"
)

# File patterns to include
INCLUDE_PATTERNS=(
    "*.ts" "*.tsx" "*.js" "*.jsx" "*.json" "*.md"
    "*.yaml" "*.yml" "*.conf" "*.env" "*.sh"
    "*.sql" "*.css" "*.scss" "*.html"
)

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -e|--exclude)
            if [[ -n $2 ]]; then
                IFS=',' read -ra NEW_EXCLUDES <<< "$2"
                EXCLUDED_DIRS+=("${NEW_EXCLUDES[@]}")
                shift 2
            else
                echo "Error: --exclude requires a pattern"
                exit 1
            fi
            ;;
        -f|--exclude-file)
            if [[ -n $2 ]]; then
                IFS=',' read -ra NEW_FILE_EXCLUDES <<< "$2"
                EXCLUDED_FILES+=("${NEW_FILE_EXCLUDES[@]}")
                shift 2
            else
                echo "Error: --exclude-file requires a pattern"
                exit 1
            fi
            ;;
        -i|--include)
            if [[ -n $2 ]]; then
                IFS=',' read -ra NEW_PATTERNS <<< "$2"
                for pattern in "${NEW_PATTERNS[@]}"; do
                    INCLUDE_PATTERNS+=("*.$pattern")
                done
                shift 2
            else
                echo "Error: --include requires a pattern"
                exit 1
            fi
            ;;
        -m|--max-size)
            if [[ -n $2 ]]; then
                MAX_SIZE=$2
                shift 2
            else
                echo "Error: --max-size requires a value"
                exit 1
            fi
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        *)
            echo "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Function to check if file should be processed
should_process_file() {
    local file=$1
    local size_kb=$(du -k "$file" | cut -f1)

    # Check file size
    if [[ $size_kb -gt $MAX_SIZE ]]; then
        [[ $VERBOSE == true ]] && echo "Skipping $file (too large: ${size_kb}KB)"
        return 1
    fi

    # Check if file is binary
    if [[ -n $(file -b --mime "$file" | grep -i "charset=binary") ]]; then
        [[ $VERBOSE == true ]] && echo "Skipping $file (binary file)"
        return 1
    fi

    return 0
}

# Function to process a file
process_file() {
    local file=$1
    local rel_path=${file#./}
    
    echo -e "\n=== File: $rel_path ===" >> "$TEMP_FILE"
    echo -e "$(cat "$file")\n" >> "$TEMP_FILE"
    
    [[ $VERBOSE == true ]] && echo "Processed: $rel_path"
}

# Main processing
echo "Starting file collection..."
echo "Output will be saved to: $OUTPUT_DIR"

# Write script execution information
echo "Nibblix Project Files Collection" > "$TEMP_FILE"
echo "Generated on: $(date)" >> "$TEMP_FILE"
echo "================================================" >> "$TEMP_FILE"

# Build the directory exclude pattern
EXCLUDE_DIR_EXPR=""
for dir in "${EXCLUDED_DIRS[@]}"; do
    EXCLUDE_DIR_EXPR="$EXCLUDE_DIR_EXPR -o -path \"*/$dir\" -o -path \"*/$dir/*\""
done
EXCLUDE_DIR_EXPR="! \( ${EXCLUDE_DIR_EXPR# -o } \)"

# Build the file exclude pattern
EXCLUDE_FILE_EXPR=""
for file in "${EXCLUDED_FILES[@]}"; do
    EXCLUDE_FILE_EXPR="$EXCLUDE_FILE_EXPR -o -name \"$file\""
done
if [[ -n "$EXCLUDE_FILE_EXPR" ]]; then
    EXCLUDE_FILE_EXPR="! \( ${EXCLUDE_FILE_EXPR# -o } \)"
fi

# Build the include pattern
INCLUDE_EXPR=""
for pattern in "${INCLUDE_PATTERNS[@]}"; do
    INCLUDE_EXPR="$INCLUDE_EXPR -o -name \"$pattern\""
done
INCLUDE_EXPR="\( ${INCLUDE_EXPR# -o } \)"

# Execute find command
eval "find . \
    $EXCLUDE_DIR_EXPR \
    $EXCLUDE_FILE_EXPR \
    -type f \
    $INCLUDE_EXPR \
    -print0" | while IFS= read -r -d '' file; do
    if should_process_file "$file"; then
        process_file "$file"
    fi
done

# Move the temporary file to final destination with timestamp
TIMESTAMP=$(date +"%H%M%S")
mv "$TEMP_FILE" "$OUTPUT_DIR/nibblix_files_$TIMESTAMP.txt"

echo "Collection complete! Files saved to: $OUTPUT_DIR/nibblix_files_$TIMESTAMP.txt"