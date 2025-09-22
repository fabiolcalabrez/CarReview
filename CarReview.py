from flask import Flask, render_template, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/marca/<nome_marca>')
def mostrar_marca(nome_marca):
    # Substitui traços na URL por underlines para corresponder ao nome do arquivo
    nome_marca = nome_marca.replace("-", "_").lower()
    return render_template(f'marcas/{nome_marca}.html')

# Nova rota para verificar login
@app.route('/user_info')
def user_info():
    return jsonify({"message": "Autenticação via Firebase"}) 

if __name__ == "__main__":
    app.run(debug=True, host='127.0.0.1', port=5000)
