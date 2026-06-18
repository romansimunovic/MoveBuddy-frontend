import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView, Alert } from 'react-native';
import API from '../api/axiosConfig';
import { COLORS } from '../theme/colors';

export default function AddActivityScreen({ route, navigation }) {
    // Provjeravamo uređujemo li postojeću aktivnost ili dodajemo novu
    const editMode = route.params?.activity;
//
    const [form, setForm] = useState({
        name: editMode?.name || '',
        duration: editMode?.duration?.toString() || '',
        distance: editMode?.distance?.toString() || '',
        description: editMode?.description || '',
        activityType: editMode?.activityType || 'TRCANJE' // Defaultni tip
    });

    const handleSave = async () => {
        const { name, duration, distance, activityType } = form;

        // Osnovna frontend validacija
        if (!name || !duration || !distance || !activityType) {
            Alert.alert('Pažnja', 'Molimo popunite sva obavezna polja.');
            return;
        }

        const payload = {
            ...form,
            duration: parseInt(form.duration),
            distance: parseFloat(form.distance),
            userId: global.currentUserId // Koristimo ID ulogiranog korisnika
        };

        try {
            if (editMode) {
                // UPDATE (PUT)
                await API.put(`/activities/${editMode.id}`, payload);
                Alert.alert('Uspjeh', 'Aktivnost je ažurirana.');
            } else {
                // CREATE (POST)
                await API.post('/activities', payload);
                Alert.alert('Uspjeh', 'Nova aktivnost je zabilježena.');
            }
            navigation.goBack(); // Vraćamo se na Dashboard
        } catch (error) {
            Alert.alert('Greška', error.response?.data?.message || 'Spremanje nije uspjelo.');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.label}>Naziv aktivnosti *</Text>
            <TextInput 
                style={styles.input} 
                placeholder="npr. Jutarnje trčanje" 
                value={form.name} 
                onChangeText={(val) => setForm({...form, name: val})} 
            />

            <View style={styles.row}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.label}>Trajanje (min) *</Text>
                    <TextInput 
                        style={styles.input} 
                        keyboardType="numeric" 
                        placeholder="45" 
                        value={form.duration} 
                        onChangeText={(val) => setForm({...form, duration: val})} 
                    />
                </View>
                <View style={{ flex: 1, marginLeft: 15 }}>
                    <Text style={styles.label}>Udaljenost (km) *</Text>
                    <TextInput 
                        style={styles.input} 
                        keyboardType="numeric" 
                        placeholder="5.2" 
                        value={form.distance} 
                        onChangeText={(val) => setForm({...form, distance: val})} 
                    />
                </View>
            </View>

            <Text style={styles.label}>Tip aktivnosti (TRCANJE, BICIKLIZAM...)</Text>
            <TextInput 
                style={styles.input} 
                autoCapitalize="characters"
                placeholder="TRCANJE" 
                value={form.activityType} 
                onChangeText={(val) => setForm({...form, activityType: val})} 
            />

            <Text style={styles.label}>Opis</Text>
            <TextInput 
                style={[styles.input, { height: 100 }]} 
                multiline 
                placeholder="Kako ste se osjećali?" 
                value={form.description} 
                onChangeText={(val) => setForm({...form, description: val})} 
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>{editMode ? 'Spremi izmjene' : 'Zabilježi aktivnost'}</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background, padding: 20 },
    label: { fontSize: 14, fontWeight: 'bold', color: COLORS.textDark, marginBottom: 5, marginTop: 15 },
    input: { backgroundColor: COLORS.surface, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: COLORS.border, fontSize: 16 },
    row: { flexDirection: 'row' },
    saveButton: { backgroundColor: COLORS.primary, padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 30, marginBottom: 50 },
    saveButtonText: { color: COLORS.surface, fontSize: 18, fontWeight: 'bold' }
});