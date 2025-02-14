# MarkItDownUI

A powerful web interface for converting various file formats to Markdown using AI technology. Built with FastAPI and supports multiple AI models including Gemini and OpenAI.

## Features

- **Multiple File Format Support**:
  - Documents: PDF, Word (doc/docx), PowerPoint (ppt/pptx), Excel (xls/xlsx)
  - Images: JPG, PNG, GIF, BMP
  - Audio: MP3, WAV, M4A, OGG
  - Web: HTML
  - Data: CSV, JSON, XML
  - Archives: ZIP

- **AI-Powered Conversion**:
  - Uses Gemini and OpenAI for intelligent content processing
  - High-quality markdown output
  - Smart content structure preservation

- **Production-Ready**:
  - Docker support for easy deployment
  - Nginx configuration included
  - CORS enabled
  - Gzip compression for better performance

- **Security Features**:
  - API key authentication
  - File size limits
  - Secure file handling

## Requirements

```
fastapi
uvicorn
python-dotenv
markitdown
google-genai
openai
```

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd markitdown
```

2. Create and activate a virtual environment (optional but recommended):
```bash
python -m venv venv
source venv/bin/activate  # For Unix/macOS
# or
.\venv\Scripts\activate  # For Windows
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
Create a `.env` file in the root directory with:
```env
MAX_CONTENT_LENGTH=52428800  # 50MB in bytes
```

## Running the Application

### Development Mode

```bash
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

### Production Mode (Docker)

1. Build and run with Docker Compose:
```bash
docker-compose up --build
```

## API Usage

### Convert File to Markdown

```http
POST /convert
```

Headers:
- `x-api-key`: Your API key (required)

Body:
- `file`: File to convert (multipart/form-data)

Response:
```json
{
    "success": true,
    "markdown": "# Converted Content..."
}
```

## Error Handling

The API returns appropriate HTTP status codes:
- `400`: Invalid request (unsupported file type, file too large)
- `401`: Invalid or missing API key
- `500`: Server error during conversion

## Development

The project structure:
```
markitdown/
├── app.py              # Main FastAPI application
├── auth.py            # Authentication logic
├── models.py          # Data models
├── requirements.txt   # Python dependencies
├── static/           # Static files
│   ├── main.js
│   └── styles.css
├── templates/        # HTML templates
│   └── index.html
├── nginx/           # Nginx configuration
│   └── default.conf
├── Dockerfile       # Docker configuration
└── docker-compose.yml
```

## License

MIT License

Copyright (c) 2024 MarkItDownUI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Contributing

We welcome contributions to MarkItDownUI! Here's how you can help:

### Reporting Issues

- Use the GitHub issue tracker to report bugs
- Describe the bug and include specific steps to reproduce
- Include any relevant error messages and screenshots

### Pull Requests

1. Fork the repository
2. Create a new branch (`git checkout -b feature/improvement`)
3. Make your changes
4. Write or update tests as needed
5. Ensure all tests pass
6. Commit your changes (`git commit -am 'Add new feature'`)
7. Push to the branch (`git push origin feature/improvement`)
8. Create a Pull Request

### Development Guidelines

- Follow PEP 8 style guide for Python code
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation for new features
- Ensure compatibility with supported Python versions (3.8+)

### Code Review Process

1. Maintainers will review your PR
2. We may request changes or improvements
3. Once approved, your code will be merged
4. Your contribution will be acknowledged in the project

Thank you for helping improve MarkItDownUI!