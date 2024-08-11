import os 

def get_qr_code_files():
    # List all files in the qr_codes directory
    files = os.listdir("qr_codes")
    # Filter out only the .png files that follow the naming convention
    qr_code_files = [f for f in files if f.startswith("qr_code_") and f.endswith(".png")]
    # Sort the files based on the number in the filename
    qr_code_files.sort(key=lambda x: int(x.split('_')[2].split('.')[0]))
    return qr_code_files
