import { Picker } from "@react-native-picker/picker";
import { child, get, ref, set } from "firebase/database";
import React, { useState } from "react";
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { database } from "./config/firebase";

export default function CadastroUsuario() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [ocupacao, setOcupacao] = useState("0");
  const [rota, setRota] = useState("1");

  const handleSalvar = async () => {
    if (!nome || !email || !senha || !ocupacao || !rota) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    try {
      const dbRef = ref(database);
      const snapshot = await get(child(dbRef, "usuarios"));
      const usuarios = snapshot.exists() ? snapshot.val() : {};
      const ids = Object.keys(usuarios).map((id) => parseInt(id));
      const novoId = ids.length > 0 ? Math.max(...ids) + 1 : 1;

      await set(ref(database, `usuarios/${novoId}`), {
        nome,
        email,
        senha,
        ocupacao,
        rota,
      });

      Alert.alert("Sucesso", "Usuário cadastrado com sucesso!");
      setNome("");
      setEmail("");
      setSenha("");
      setOcupacao("0");
      setRota("1");
    } catch (error) {
      Alert.alert("Erro", "Erro ao salvar usuário.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Usuário</Text>

      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
        placeholder="Digite o nome"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Digite o e-mail"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Senha</Text>
      <TextInput
        style={styles.input}
        value={senha}
        onChangeText={setSenha}
        placeholder="Digite a senha"
        secureTextEntry
      />

      <Text style={styles.label}>Ocupação</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={ocupacao}
          onValueChange={(value) => setOcupacao(value)}
          style={styles.picker}
        >
          <Picker.Item label="Passageiro" value="0" />
          <Picker.Item label="Motorista" value="1" />
        </Picker>
      </View>

      <Text style={styles.label}>Rota</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={rota}
          onValueChange={(value) => setRota(value)}
          style={styles.picker}
        >
          <Picker.Item label="Rota 1" value="1" />
          <Picker.Item label="Rota 2" value="2" />
          <Picker.Item label="Rota 3" value="3" />
        </Picker>
      </View>

      <Button title="Salvar Usuário" onPress={handleSalvar} color="#007BFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  label: { marginTop: 10, marginBottom: 5, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
    marginBottom: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
  picker: {
    height: 40,
    width: "100%",
  },
});
