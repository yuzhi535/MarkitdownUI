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
  - Automated deployment with GitHub Actions

- **Security Features**:
  - API key authentication
  - File size limits
  - Secure file handling

## Project Structure

```
markitdown/
├── .github/
│   └── workflows/        # GitHub Actions workflows
│       └── deploy.yml    # Deployment configuration
├── Backend
│   ├── app.py           # Main FastAPI application
│   ├── auth.py          # Authentication logic
│   ├── models.py        # Data models
│   └── requirements.txt # Python dependencies
├── Frontend
│   ├── static/         # Static assets
│   │   ├── main.js     # Frontend application logic
│   │   ├── styles.css  # Global styles
│   │   └── css/
│   │       └── style.css # Component styles
│   └── templates/      # HTML templates
│       ├── index.html  # Main application page
│       └── config_notice.html
├── nginx/             # Nginx configuration
│   └── default.conf
├── Dockerfile        # Docker configuration
└── docker-compose.yml
```

## Running the Application

### Development Mode

1. Install backend dependencies:
```bash
python -m venv venv
source venv/bin/activate  # For Unix/macOS
# or
.\venv\Scripts\activate  # For Windows

pip install -r requirements.txt
```

2. Start the backend server:
```bash
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

3. Access the application:
   - Open your browser and navigate to `http://localhost:8000`
   - The frontend will be automatically served by the FastAPI backend
   - First-time users will be prompted to enter their API key

Note: In development mode, CORS is configured to allow requests from any origin, so you can access the API from any domain for testing purposes.

### Production Mode (Docker)

1. Update the CORS configuration in `app.py`:
   ```python
   origins = [
       "http://your-domain.com",  # Replace with your production domain
       "https://your-domain.com"
   ]
   ```

2. Build and run with Docker Compose:
```bash
docker-compose up --build
```

3. Access the application:
   - Open your browser and navigate to `http://localhost` (or your configured domain)
   - The frontend will be served through Nginx
   - First-time users will be prompted to enter their API key

## Automated Deployment

The project includes GitHub Actions workflow for automated deployment. The workflow:
1. Runs tests
2. Builds Docker image
3. Pushes to Docker Hub
4. Deploys to production server

### Required Secrets

Set up the following secrets in your GitHub repository:

1. Docker Hub credentials:
   - `DOCKERHUB_USERNAME`: Your Docker Hub username
   - `DOCKERHUB_TOKEN`: Docker Hub access token

2. Server credentials:
   - `SERVER_HOST`: Production server hostname/IP
   - `SERVER_USERNAME`: SSH username
   - `SERVER_SSH_KEY`: SSH private key for server access

### Deployment Process

1. Push to main branch triggers deployment:
```bash
git push origin main
```

2. GitHub Actions will:
   - Run tests
   - Build Docker image
   - Push to Docker Hub
   - Deploy to production server
   - Cleanup old containers

3. Monitor deployment:
   - Check GitHub Actions tab for deployment status
   - Review logs in Actions workflow
   - Verify application status on production server

## Frontend Development

The frontend is a static web application served by the FastAPI backend. No separate frontend server or build process is required.

### Modifying the Frontend

1. Edit the frontend files:
   - `templates/index.html` - Main HTML template
   - `static/main.js` - Frontend JavaScript logic
   - `static/styles.css` and `static/css/style.css` - CSS styles

2. Changes take effect immediately:
   - After editing frontend files, simply refresh your browser
   - No build step or separate server required
   - The FastAPI backend serves the updated files automatically

### Frontend Dependencies
The frontend uses vanilla JavaScript and doesn't require any external dependencies or package manager. All necessary styles and scripts are included in the static files.

## Backend Setup

### Requirements

```
fastapi
uvicorn
python-dotenv
markitdown
google-genai
openai
```

### Installation

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