import { useRouter } from "expo-router";
import { onValue, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { database } from "./config/firebase";

export default function LoginScreen() {
  const router = useRouter();

  const [inputEmail, setInputEmail] = useState("");
  const [inputSenha, setInputSenha] = useState("");
  const [usuarios, setUsuarios] = useState<any[]>([]);

  useEffect(() => {
    const usuariosRef = ref(database, "usuarios");
    const unsubscribe = onValue(usuariosRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const listaUsuarios = Object.values(data);
        setUsuarios(listaUsuarios);
      }
    });

    return () => unsubscribe();
  }, []);

  function login() {
    const usuarioEncontrado = usuarios.find(
      (user: any) => user.email === inputEmail && user.senha === inputSenha
    );

    if (usuarioEncontrado) {
      router.push("/(tabs)/assentos"); // ajuste conforme sua rota protegida
    } else {
      Alert.alert("Erro", "Email ou senha inválidos");
      setInputEmail("");
      setInputSenha("");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={inputEmail}
        onChangeText={setInputEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={inputSenha}
        onChangeText={setInputSenha}
      />
      <TouchableOpacity style={styles.button} onPress={login}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/CadastrarUsuario")}>
        <Text style={{ marginTop: 10, color: "#007AFF" }}>Criar conta</Text>
      </TouchableOpacity>
       <TouchableOpacity onPress={() => router.push("/ListaUsuarios")}></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff",
  },
  title: {
    fontSize: 24, fontWeight: "bold", marginBottom: 20,
  },
  input: {
    width: "80%", padding: 10, marginBottom: 10,
    borderWidth: 1, borderColor: "#ccc", borderRadius: 5,
  },
  button: {
    backgroundColor: "#007AFF", padding: 10, borderRadius: 5,
  },
  buttonText: {
    color: "#fff", fontSize: 18,
  },
});
