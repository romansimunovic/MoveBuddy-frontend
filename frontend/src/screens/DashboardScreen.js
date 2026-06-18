import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import API from '../api/axiosConfig';
import { COLORS } from '../theme/colors';

export default function DashboardScreen() {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        try {
            const response = await API.get('/activities');
            setActivities(response.data);
        } catch (error) {
            console.error('Greška pri dohvaćanju aktivnosti:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderActivityItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.activityName}>{item.name}</Text>
                <Text style={styles.badge}>{item.activityType}</Text>
            </View>
            <Text style={styles.description}>{item.description}</Text>
            <View style={styles.metaRow}>
                <Text style={styles.metaText}>⏱️ {item.duration} min</Text>
                <Text style={styles.metaText}>📍 {item.distance} km</Text>
            </View>
            <TouchableOpacity 
    onPress={() => navigation.navigate('AddActivity', { activity: item })}
    onLongPress={() => handleDelete(item.id)}
>
   {/* Tvoja postojeća Card komponenta */}
</TouchableOpacity>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Moje Aktivnosti</Text>
            
            {activities.length === 0 ? (
                <View style={styles.center}>
                    <Text style={styles.emptyText}>Nema zabilježenih aktivnosti. Kreni s kretanjem!</Text>
                </View>
            ) : (
                <FlatList 
                    data={activities}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderActivityItem}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}
        </View>
    );

    const handleDelete = (id) => {
    Alert.alert(
        "Brisanje",
        "Jeste li sigurni da želite obrisati ovu aktivnost?",
        [
            { text: "Odustani", style: "cancel" },
            { text: "Obriši", style: "destructive", onPress: async () => {
                try {
                    await API.delete(`/activities/${id}`);
                    fetchActivities(); // Osvježava listu
                } catch (error) {
                    Alert.alert("Greška", "Brisanje nije uspjelo.");
                }
            }}
        ]
    );
};

}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background, padding: 20 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.textDark, marginBottom: 20, marginTop: 40 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { fontSize: 16, color: COLORS.textLight, textAlign: 'center' },
    card: { backgroundColor: COLORS.surface, borderRadius: 12, padding: 15, marginBottom: 15, borderWidth: 1, borderColor: COLORS.border, elevation: 2 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    activityName: { fontSize: 18, fontWeight: 'bold', color: COLORS.textDark },
    badge: { backgroundColor: COLORS.primary + '20', color: COLORS.primary, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, fontSize: 12, fontWeight: 'bold' },
    description: { fontSize: 14, color: COLORS.textLight, marginBottom: 12 },
    metaRow: { flexDirection: 'row', gap: 20 },
    metaText: { fontSize: 14, fontWeight: '600', color: COLORS.textDark }
});