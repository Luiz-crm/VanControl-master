import { Picker } from "@react-native-picker/picker";
import { onValue, ref, remove, set } from "firebase/database";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { database } from "./config/firebase";

export default function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);

  // Carrega usuários em tempo real
  useEffect(() => {
    const usuariosRef = ref(database, "usuarios");
    const unsubscribe = onValue(usuariosRef, (snapshot) => {
      if (snapshot.exists()) {
        setUsuarios(snapshot.val());
      } else {
        setUsuarios({});
      }
    });
    return () => unsubscribe();
  }, []);

  // Excluir usuário com confirmação
  const handleDelete = (id) => {
    const nome = usuarios[id]?.nome || "usuário";
    Alert.alert(
      "Confirmar exclusão",
      `Deseja realmente excluir o usuário "${nome}" (ID ${id})?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Deletar",
          style: "destructive",
          onPress: async () => {
            try {
              await remove(ref(database, `usuarios/${id}`));
              Alert.alert("Sucesso", "Usuário deletado.");
            } catch (error) {
              Alert.alert("Erro", "Falha ao deletar usuário.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Abre o modal com dados do usuário
  const openEditModal = (id, dados) => {
    setUsuarioEditando({ id, ...dados });
    setModalVisible(true);
  };

  // Salva as edições no Firebase
  const handleSaveEdit = async () => {
    const { id, nome, email, senha, ocupacao, rota } = usuarioEditando;

    if (!nome || !email || !senha || !ocupacao || !rota) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    try {
      await set(ref(database, `usuarios/${id}`), {
        nome,
        email,
        senha,
        ocupacao,
        rota,
      });
      Alert.alert("Sucesso", "Usuário atualizado.");
      setModalVisible(false);
      setUsuarioEditando(null);
    } catch (error) {
      Alert.alert("Erro", "Falha ao atualizar usuário.");
    }
  };

  // Atualiza campo específico do usuário sendo editado
  const updateUsuarioEditando = (field, value) => {
    setUsuarioEditando((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Usuários Cadastrados</Text>

      {Object.keys(usuarios).length === 0 ? (
        <Text>Nenhum usuário cadastrado.</Text>
      ) : (
        <FlatList
          data={Object.entries(usuarios)}
          keyExtractor={([id]) => id}
          style={{ width: "100%" }}
          renderItem={({ item }) => {
            const [id, dados] = item;
            return (
              <View style={styles.userContainer}>
                <View style={{ flex: 1 }}>
                  <Text>ID: {id}</Text>
                  <Text>Nome: {dados.nome}</Text>
                  <Text>Email: {dados.email}</Text>
                  <Text>Ocupação: {dados.ocupacao === "0" ? "Passageiro" : "Motorista"}</Text>
                  <Text>Rota: {dados.rota}</Text>
                </View>

                <View style={styles.buttonsContainer}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => openEditModal(id, dados)}
                  >
                    <Text style={styles.buttonText}>Editar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(id)}
                  >
                    <Text style={styles.buttonText}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      )}

      {/* Modal de edição */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Editar Usuário</Text>

            <Text style={styles.label}>Nome</Text>
            <TextInput
              style={styles.input}
              value={usuarioEditando?.nome}
              onChangeText={(text) => updateUsuarioEditando("nome", text)}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={usuarioEditando?.email}
              keyboardType="email-address"
              onChangeText={(text) => updateUsuarioEditando("email", text)}
            />

            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              value={usuarioEditando?.senha}
              secureTextEntry
              onChangeText={(text) => updateUsuarioEditando("senha", text)}
            />

            <Text style={styles.label}>Ocupação</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={usuarioEditando?.ocupacao}
                onValueChange={(value) => updateUsuarioEditando("ocupacao", value)}
                style={styles.picker}
              >
                <Picker.Item label="Passageiro" value="0" />
                <Picker.Item label="Motorista" value="1" />
              </Picker>
            </View>

            <Text style={styles.label}>Rota</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={usuarioEditando?.rota}
                onValueChange={(value) => updateUsuarioEditando("rota", value)}
                style={styles.picker}
              >
                <Picker.Item label="Rota 1" value="1" />
                <Picker.Item label="Rota 2" value="2" />
                <Picker.Item label="Rota 3" value="3" />
              </Picker>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#28a745" }]}
                onPress={handleSaveEdit}
              >
                <Text style={styles.buttonText}>Salvar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#6c757d" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },

  userContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
    alignItems: "center",
  },

  buttonsContainer: {
    flexDirection: "row",
  },

  editButton: {
    backgroundColor: "#007bff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginRight: 8,
  },

  deleteButton: {
    backgroundColor: "#dc3545",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },

  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },

  label: {
    fontWeight: "600",
    marginBottom: 5,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    height: 40,
  },

  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
  },

  picker: {
    height: 40,
    width: "100%",
  },

  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  button: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
});
