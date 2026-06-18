import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import API from '../api/axiosConfig';
import { COLORS } from '../theme/colors';
//
export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Greška', 'Molimo ispunite sva polja.');
            return;
        }

        try {
            const response = await API.post('/auth/login', { email, password });
            
            if (response.status === 200) {
                // Spremamo token globalno za potrebe testiranja
                global.userToken = response.data.accessToken;
                global.currentUserId = response.data.userId || 1; // Prilagodi ovisno što ti login vraća
                
                Alert.alert('Uspjeh', 'Uspješno ste se prijavili!');
                // Ovdje inače ideš na Dashboard:
                // navigation.navigate('Dashboard');
            }
        } catch (error) {
            Alert.alert('Prijava neuspješna', error.response?.data?.message || 'Provjerite podatke.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>MoveBuddy</Text>
            <Text style={styles.subtitle}>Prijavite se u svoj račun</Text>

            <TextInput 
                style={styles.input}
                placeholder="E-mail adresa"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <TextInput 
                style={styles.input}
                placeholder="Lozinka"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Prijavi se</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', padding: 20 },
    title: { fontSize: 32, fontWeight: 'bold', color: COLORS.primary, textAlign: 'center', marginBottom: 5 },
    subtitle: { fontSize: 16, color: COLORS.textLight, textAlign: 'center', marginBottom: 30 },
    input: { backgroundColor: COLORS.surface, padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: COLORS.border, fontSize: 16 },
    button: { backgroundColor: COLORS.primary, padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
    buttonText: { color: COLORS.surface, fontSize: 18, fontWeight: 'bold' }
});