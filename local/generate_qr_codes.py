import os
import segno

URL = "https://vinylscanner.vercel.app/api/vinyls/"
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
QR_CODES_DIR = os.path.join(ROOT_DIR, "qr_codes")
os.makedirs(QR_CODES_DIR, exist_ok=True)

def generate_qr_code(url: str, file_path: str):
    qr = segno.make(url, error='h')
    # Save the QR code with the specified colors
    qr.save(file_path, scale=10, border=2, dark='lightgrey', light='darkred')
    print(f"Custom QR code generated and saved to {file_path}")

if __name__ == "__main__":
    for i in range(1, 9):
        # Generate the full file path inside the qr_codes directory
        file_path = os.path.join(QR_CODES_DIR, f"qr_code_{i}.png")
        generate_qr_code(f"{URL}{i}", file_path)
