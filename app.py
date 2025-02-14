from fastapi import FastAPI, File, UploadFile, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from markitdown import MarkItDown
from google import genai
from openai import OpenAI
import tempfile
import os
import logging
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

# 配置日志
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = FastAPI()

# 配置CORS
origins = ["*"]  # 允许所有域名，用于开发环境。生产环境中请配置具体的域名。

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# 配置静态文件和模板
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# 添加Gzip压缩支持
app.add_middleware(GZipMiddleware)

@app.get("/")
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/convert")
async def convert_file(
    request: Request,
    file: UploadFile = File(...),
):
    # 获取API密钥优先从请求头获取
    headers = request.headers
    api_key = headers.get('x-api-key')
    
    # 如果请求头中没有，尝试从表单数据获取
    if not api_key:
        form = await request.form()
        api_key = form.get("api_key")
    
    logger.debug(f"找到的API密钥: {api_key is not None}")
    
    if not api_key:
        return JSONResponse(
            status_code=401,
            content={"success": False, "error": "未提供API密钥"}
        )

    # 验证API密钥格式
    if not isinstance(api_key, str) or not api_key.strip().startswith('AI'):
        return JSONResponse(
            status_code=401,
            content={"success": False, "error": "无效的API密钥格式"}
        )
        
    # 初始化客户端
    try:
        api_key = api_key.strip()
        client = genai.Client(api_key=api_key)
        client = OpenAI(
            api_key=api_key,
            base_url="https://gemini.zayx.me/v1beta/openai/"
        )
        md = MarkItDown(llm_client=client, llm_model="gemini-2.0-flash")
    except Exception as e:
        logger.error(f"API密钥验证失败: {str(e)}")
        return JSONResponse(
            status_code=401,
            content={"success": False, "error": "API密钥验证失败"}
        )

    # 添加请求信息日志
    logger.info(f"接收到文件上传请求: filename={file.filename}, content_type={file.content_type}")
    
    if not file:
        logger.error("没有收到文件")
        return JSONResponse(
            status_code=400,
            content={"success": False, "error": "没有收到文件"}
        )

    # 检查文件类型
    allowed_extensions = {
        '.pdf',  # PDF文件
        '.ppt', '.pptx',  # PowerPoint
        '.doc', '.docx',  # Word
        '.xls', '.xlsx',  # Excel
        '.jpg', '.jpeg', '.png', '.gif', '.bmp',  # 图片
        '.mp3', '.wav', '.m4a', '.ogg',  # 音频
        '.html', '.htm',  # HTML
        '.csv', '.json', '.xml',  # 文本格式
        '.zip'  # ZIP压缩文件
    }
    
    file_ext = os.path.splitext(file.filename)[1].lower()
    
    logger.info(f"文件扩展名: {file_ext}")
    
    if not file_ext or file_ext not in allowed_extensions:
        logger.error(f"不支持的文件类型: {file_ext}")
        return JSONResponse(
            status_code=400,
            content={"success": False, "error": f"不支持的文件类型: {file_ext}"}
        )

    content = await file.read()
    file_size = len(content)
    logger.info(f"文件大小: {file_size} bytes")

    if file_size > int(os.getenv('MAX_CONTENT_LENGTH', 50 * 1024 * 1024)):  # 50MB限制
        logger.error(f"文件太大: {file_size} bytes")
        return JSONResponse(
            status_code=400,
            content={"success": False, "error": "文件大小超过限制"}
        )

    # 新增 try 包裹 with 块
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_ext) as temp_file:
            temp_file.write(content)
            temp_path = temp_file.name
            logger.info(f"创建临时文件: {temp_path}")

            try:
                logger.info("开始转换文件")
                result = md.convert(temp_path)
                
                # 检查转换结果
                if not result:
                    raise ValueError("转换结果为空")
                
                if not hasattr(result, 'text_content'):
                    raise ValueError("转换结果缺少text_content属性")

                response_data = {
                    "success": True,
                    "markdown": result.text_content or ""
                }
                
                logger.info("文件转换成功")
                return JSONResponse(
                    status_code=200,
                    content=response_data
                )

            except Exception as e:
                logger.exception("文件转换失败")
                return JSONResponse(
                    status_code=500,
                    content={
                        "success": False,
                        "error": f"转换失败: {str(e)}"
                    }
                )
            finally:
                try:
                    os.unlink(temp_path)
                    logger.info(f"删除临时文件: {temp_path}")
                except Exception as e:
                    logger.error(f"清理临时文件失败: {str(e)}")
    except Exception as e:
        logger.exception("处理请求时发生错误")
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error": f"服务器错误: {str(e)}"
            }
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
