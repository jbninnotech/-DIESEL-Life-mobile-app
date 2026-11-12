import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ComponentRef, Fragment, useMemo, useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type IconName = keyof typeof Ionicons.glyphMap;

export type BookDieselData = {
  siteType: string;
  siteName: string;
  address: string;
  contactName: string;
  phone: string;
  litres: number;
  date: string;
  slot: string;
  payment: string;
  tokenBooking: boolean;
  total: number;
  payNow: number;
  notes: string;
};

type Props = {
  onSubmit?: (data: BookDieselData) => void;
  ratePerLitre?: number;
  unavailableSlots?: string[];
};

const ACCENT = "#35d1e6";
const DANGER = "#ff4d4f";
const INK = "#1b2a31";
const MUTED = "#6b7c85";
const GRADIENT = ["#1e6fe8", "#35d1e6", "#2fdc8f"] as const;

const MIN_LITRES = 100;
const MAX_LITRES = 10000;
const STEP_LITRES = 100;
const TOKEN_PERCENT = 10;

const STEPS = ["Delivery", "Slot", "Review"];

const SUBTITLES = [
  "Where and how much fuel you need",
  "Pick a delivery date and time",
  "Check your order and pay",
];

const SITE_TYPES: { label: string; value: string; icon: IconName }[] = [
  { label: "Generator", value: "generator", icon: "flash" },
  { label: "Machinery", value: "machinery", icon: "construct" },
  { label: "Vehicles", value: "vehicles", icon: "car" },
  { label: "Storage Tank", value: "tank", icon: "cube" },
];

const LITRE_PRESETS = [500, 1000, 2000, 5000];

const SLOTS = [
  { label: "8 AM - 10 AM", value: "s1", startHour: 8 },
  { label: "10 AM - 12 PM", value: "s2", startHour: 10 },
  { label: "12 PM - 2 PM", value: "s3", startHour: 12 },
  { label: "2 PM - 4 PM", value: "s4", startHour: 14 },
  { label: "4 PM - 6 PM", value: "s5", startHour: 16 },
  { label: "6 PM - 8 PM", value: "s6", startHour: 18 },
];

const PAYMENTS: { label: string; value: string; note: string; icon: IconName }[] = [
  { label: "Wallet", value: "wallet", note: "Pay from your wallet balance", icon: "wallet" },
  { label: "UPI / Online", value: "upi", note: "UPI, cards and net banking", icon: "phone-portrait" },
  { label: "Cash", value: "cash", note: "Pay the driver on delivery", icon: "cash" },
  { label: "Credit / Cheque", value: "credit", note: "For approved business accounts", icon: "card" },
];

const pad = (n: number) => String(n).padStart(2, "0");

const formatINR = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

const buildDates = () =>
  Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      value: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
      day: i === 0 ? "Today" : d.toLocaleDateString("en-IN", { weekday: "short" }),
      num: String(d.getDate()),
      month: d.toLocaleDateString("en-IN", { month: "short" }),
    };
  });

type FieldProps = TextInputProps & {
  label: string;
  icon: IconName;
  error?: string;
};

function Field({ label, icon, error, multiline, ...rest }: FieldProps) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.inputRow,
          multiline && styles.inputRowMulti,
          !!error && styles.inputRowError,
        ]}
      >
        <Ionicons
          name={icon}
          size={20}
          color={ACCENT}
          style={multiline ? styles.iconTop : undefined}
        />
        <TextInput
          {...rest}
          multiline={multiline}
          placeholderTextColor="#9aa7ad"
          style={[styles.input, multiline && styles.inputMulti]}
        />
      </View>
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

function SummaryRow({ icon, label, value }: { icon: IconName; label: string; value: string }) {
  return (
    <View style={styles.summaryRow}>
      <View style={styles.summaryIcon}>
        <Ionicons name={icon} size={18} color={ACCENT} />
      </View>
      <View style={styles.summaryText}>
        <Text style={styles.summaryLabel}>{label}</Text>
        <Text style={styles.summaryValue}>{value}</Text>
      </View>
    </View>
  );
}

function BillRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <View style={styles.billRow}>
      <Text style={[styles.billLabel, bold && styles.billBold]}>{label}</Text>
      <Text style={[styles.billValue, bold && styles.billBold]}>{value}</Text>
    </View>
  );
}

export default function BookDiesel({
  onSubmit,
  ratePerLitre = 92,
  unavailableSlots = [],
}: Props) {
  const router = useRouter();
  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);
  const dates = useMemo(buildDates, []);

  const [step, setStep] = useState(0);
  const [siteType, setSiteType] = useState("");
  const [siteName, setSiteName] = useState("");
  const [address, setAddress] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [litresText, setLitresText] = useState("500");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(dates[0].value);
  const [slot, setSlot] = useState("");
  const [payment, setPayment] = useState("");
  const [tokenBooking, setTokenBooking] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const litres = Number(litresText) || 0;
  const total = litres * ratePerLitre;
  const tokenAmount = Math.ceil((total * TOKEN_PERCENT) / 100);
  const isOnline = payment === "wallet" || payment === "upi";
  const payNow = tokenBooking ? tokenAmount : isOnline ? total : 0;

  const selectedDate = dates.find((d) => d.value === date) ?? dates[0];
  const selectedSlot = SLOTS.find((s) => s.value === slot);
  const selectedSite = SITE_TYPES.find((s) => s.value === siteType);
  const selectedPayment = PAYMENTS.find((p) => p.value === payment);

  const slotState = (slotValue: string, startHour: number) => {
    if (unavailableSlots.includes(`${date}|${slotValue}`)) return "full";
    if (date === dates[0].value && new Date().getHours() >= startHour) return "past";
    return "open";
  };

  const changeLitres = (delta: number) => {
    const next = Math.min(MAX_LITRES, Math.max(MIN_LITRES, litres + delta));
    setLitresText(String(next));
  };

  const clampLitres = () => {
    if (!litresText) return;
    setLitresText(String(Math.min(MAX_LITRES, Math.max(MIN_LITRES, litres))));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (step === 0) {
      if (!siteType) next.siteType = "Select what you are fuelling";
      if (siteName.trim().length < 2) next.siteName = "Enter the site or asset name";
      if (address.trim().length < 8) next.address = "Enter the full delivery address";
      if (contactName.trim().length < 2) next.contactName = "Enter the contact person";
      if (!/^\d{10}$/.test(phone)) next.phone = "Enter a valid 10 digit number";
      if (litres < MIN_LITRES || litres > MAX_LITRES) {
        next.litres = `Order between ${MIN_LITRES} and ${MAX_LITRES} litres`;
      }
    }
    if (step === 1) {
      if (!selectedSlot) next.slot = "Choose a delivery time";
    }
    if (step === 2) {
      if (!payment) next.payment = "Choose a payment method";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const goTo = (target: number) => {
    setStep(target);
    setErrors({});
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  };

  const submit = () => {
    const data: BookDieselData = {
      siteType,
      siteName: siteName.trim(),
      address: address.trim(),
      contactName: contactName.trim(),
      phone,
      litres,
      date,
      slot,
      payment,
      tokenBooking,
      total,
      payNow,
      notes: notes.trim(),
    };
    if (onSubmit) return onSubmit(data);
    Alert.alert(
      "Booking confirmed",
      `${litres} L of diesel is booked for ${selectedDate.day}, ${selectedDate.num} ${selectedDate.month}.`,
      [{ text: "OK", onPress: () => router.back() }]
    );
  };

  const next = () => {
    if (!validate()) return;
    if (step < STEPS.length - 1) return goTo(step + 1);
    submit();
  };

  const back = () => {
    if (step === 0) return router.back();
    goTo(step - 1);
  };

  const isLast = step === STEPS.length - 1;
  const primaryLabel = !isLast
    ? "Continue"
    : payNow > 0
    ? `Pay ${formatINR(payNow)} & Confirm`
    : "Confirm Booking";

  return (
    <LinearGradient
      colors={GRADIENT}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.flex}
    >
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.flex}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.header}>
            {/* <Pressable onPress={back} style={styles.backButton} hitSlop={10}>
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </Pressable> */}
            <View style={styles.headerText}>
              <Text style={styles.title}>Book Diesel</Text>
              <Text style={styles.subtitle}>{SUBTITLES[step]}</Text>
            </View>
            
          </View>

          <View style={styles.stepper}>
            {STEPS.map((label, i) => {
              const done = i < step;
              const active = i === step;
              return (
                <Fragment key={label}>
                  {i > 0 && (
                    <View style={[styles.stepLine, i <= step && styles.stepLineOn]} />
                  )}
                  <View style={styles.stepCol}>
                    <View style={[styles.stepCircle, (done || active) && styles.stepCircleOn]}>
                      {done ? (
                        <Ionicons name="checkmark" size={17} color={ACCENT} />
                      ) : (
                        <Text style={[styles.stepNum, active && { color: ACCENT }]}>{i + 1}</Text>
                      )}
                    </View>
                    <Text style={[styles.stepLabel, (done || active) && styles.stepLabelOn]}>
                      {label}
                    </Text>
                  </View>
                </Fragment>
              );
            })}
          </View>

          <ScrollView
            ref={scrollRef}
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {step === 0 && (
              <View style={styles.card}>
                <View style={styles.fieldWrap}>
                  <Text style={styles.label}>What are you fuelling?</Text>
                  <View style={styles.tiles}>
                    {SITE_TYPES.map((s) => {
                      const active = s.value === siteType;
                      return (
                        <Pressable
                          key={s.value}
                          onPress={() => setSiteType(s.value)}
                          style={[styles.tile, active && styles.tileActive]}
                        >
                          <View style={[styles.tileIcon, active && styles.tileIconActive]}>
                            <Ionicons name={s.icon} size={20} color={active ? "#fff" : ACCENT} />
                          </View>
                          <Text style={styles.tileText}>{s.label}</Text>
                        </Pressable>
                      );
                    })}
                  </View>
                  {!!errors.siteType && <Text style={styles.errorText}>{errors.siteType}</Text>}
                </View>

                <Field
                  label="Site / Asset Name"
                  icon="business"
                  placeholder="Eg. Plot 12 construction site"
                  value={siteName}
                  onChangeText={setSiteName}
                  error={errors.siteName}
                />
                <Field
                  label="Delivery Address"
                  icon="location"
                  placeholder="Street, area, city, landmark"
                  value={address}
                  onChangeText={setAddress}
                  error={errors.address}
                  multiline
                />
                <Field
                  label="Contact Person"
                  icon="person"
                  placeholder="Person at the site"
                  value={contactName}
                  onChangeText={setContactName}
                  error={errors.contactName}
                  autoCapitalize="words"
                />
                <Field
                  label="Contact Number"
                  icon="call"
                  placeholder="10 digit mobile number"
                  value={phone}
                  onChangeText={(t) => setPhone(t.replace(/\D/g, ""))}
                  error={errors.phone}
                  keyboardType="phone-pad"
                  maxLength={10}
                />

                <View style={styles.fieldWrap}>
                  <Text style={styles.label}>Fuel Quantity</Text>
                  <View style={[styles.qtyBox, !!errors.litres && styles.inputRowError]}>
                    <Pressable
                      onPress={() => changeLitres(-STEP_LITRES)}
                      style={styles.qtyButton}
                      hitSlop={8}
                    >
                      <Ionicons name="remove" size={24} color="#fff" />
                    </Pressable>
                    <View style={styles.qtyCenter}>
                      <TextInput
                        value={litresText}
                        onChangeText={(t) => setLitresText(t.replace(/\D/g, ""))}
                        onBlur={clampLitres}
                        keyboardType="number-pad"
                        maxLength={5}
                        style={styles.qtyInput}
                      />
                      <Text style={styles.qtyUnit}>litres</Text>
                    </View>
                    <Pressable
                      onPress={() => changeLitres(STEP_LITRES)}
                      style={styles.qtyButton}
                      hitSlop={8}
                    >
                      <Ionicons name="add" size={24} color="#fff" />
                    </Pressable>
                  </View>
                  <View style={styles.chips}>
                    {LITRE_PRESETS.map((v) => {
                      const active = v === litres;
                      return (
                        <Pressable
                          key={v}
                          onPress={() => setLitresText(String(v))}
                          style={[styles.chip, active && styles.chipActive]}
                        >
                          <Text style={[styles.chipText, active && styles.chipTextActive]}>
                            {v} L
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                  {!!errors.litres && <Text style={styles.errorText}>{errors.litres}</Text>}
                  <Text style={styles.hint}>
                    Estimated {formatINR(total)} at {formatINR(ratePerLitre)} per litre
                  </Text>
                </View>

                <Field
                  label="Notes (optional)"
                  icon="create"
                  placeholder="Gate number, tank location, timing notes"
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                />
              </View>
            )}

            {step === 1 && (
              <View style={styles.card}>
                <View style={styles.fieldWrap}>
                  <Text style={styles.label}>Delivery Date</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.dateRow}
                  >
                    {dates.map((d) => {
                      const active = d.value === date;
                      return (
                        <Pressable
                          key={d.value}
                          onPress={() => {
                            setDate(d.value);
                            setSlot("");
                          }}
                          style={[styles.dateTile, active && styles.dateTileActive]}
                        >
                          <Text style={[styles.dateDay, active && styles.dateTextActive]}>
                            {d.day}
                          </Text>
                          <Text style={[styles.dateNum, active && styles.dateTextActive]}>
                            {d.num}
                          </Text>
                          <Text style={[styles.dateMonth, active && styles.dateTextActive]}>
                            {d.month}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </ScrollView>
                </View>

                <View style={styles.fieldWrap}>
                  <Text style={styles.label}>Delivery Time</Text>
                  <View style={styles.slotGrid}>
                    {SLOTS.map((s) => {
                      const state = slotState(s.value, s.startHour);
                      const disabled = state !== "open";
                      const active = s.value === slot && !disabled;
                      return (
                        <Pressable
                          key={s.value}
                          disabled={disabled}
                          onPress={() => setSlot(s.value)}
                          style={[
                            styles.slot,
                            active && styles.slotActive,
                            disabled && styles.slotDisabled,
                          ]}
                        >
                          <Text
                            style={[
                              styles.slotText,
                              active && styles.slotTextActive,
                              disabled && styles.slotTextDisabled,
                            ]}
                          >
                            {s.label}
                          </Text>
                          {disabled && (
                            <Text style={styles.slotTag}>
                              {state === "full" ? "Full" : "Closed"}
                            </Text>
                          )}
                        </Pressable>
                      );
                    })}
                  </View>
                  {!!errors.slot && <Text style={styles.errorText}>{errors.slot}</Text>}
                </View>

                <View style={styles.infoBox}>
                  <Ionicons name="shield-checkmark" size={22} color={ACCENT} />
                  <Text style={styles.infoText}>
                    Scheduled slot deliveries are free. Fuel arrives in a sealed tanker with
                    quantity checked at your site.
                  </Text>
                </View>
              </View>
            )}

            {step === 2 && (
              <>
                <View style={styles.card}>
                  <Text style={styles.sectionTitle}>Order Summary</Text>
                  <SummaryRow
                    icon={selectedSite?.icon ?? "flash"}
                    label={selectedSite?.label ?? "Site"}
                    value={siteName.trim()}
                  />
                  <SummaryRow icon="location" label="Delivery Address" value={address.trim()} />
                  <SummaryRow
                    icon="person"
                    label="Contact"
                    value={`${contactName.trim()}  ${phone}`}
                  />
                  <SummaryRow
                    icon="time"
                    label="Delivery Slot"
                    value={`${selectedDate.day}, ${selectedDate.num} ${selectedDate.month}  ${selectedSlot?.label ?? ""}`}
                  />

                  <View style={styles.divider} />

                  <BillRow label={`Diesel (${litres} L x ${formatINR(ratePerLitre)})`} value={formatINR(total)} />
                  <BillRow label="Delivery" value="FREE" />
                  <BillRow label="Total" value={formatINR(total)} bold />
                </View>

                <View style={[styles.card, styles.cardGap]}>
                  <Text style={styles.sectionTitle}>Payment Method</Text>
                  {PAYMENTS.map((p) => {
                    const active = p.value === payment;
                    return (
                      <Pressable
                        key={p.value}
                        onPress={() => setPayment(p.value)}
                        style={[styles.payRow, active && styles.payRowActive]}
                      >
                        <View style={[styles.tileIcon, active && styles.tileIconActive]}>
                          <Ionicons name={p.icon} size={20} color={active ? "#fff" : ACCENT} />
                        </View>
                        <View style={styles.payText}>
                          <Text style={styles.payLabel}>{p.label}</Text>
                          <Text style={styles.payNote}>{p.note}</Text>
                        </View>
                        <Ionicons
                          name={active ? "radio-button-on" : "radio-button-off"}
                          size={22}
                          color={active ? ACCENT : "#b4c3c9"}
                        />
                      </Pressable>
                    );
                  })}
                  {!!errors.payment && <Text style={styles.errorText}>{errors.payment}</Text>}

                  <View style={styles.tokenRow}>
                    <View style={styles.payText}>
                      <Text style={styles.payLabel}>Book with a token</Text>
                      <Text style={styles.payNote}>
                        Pay {TOKEN_PERCENT}% ({formatINR(tokenAmount)}) now to reserve the slot
                      </Text>
                    </View>
                    <Switch
                      value={tokenBooking}
                      onValueChange={setTokenBooking}
                      trackColor={{ false: "#d3dde1", true: ACCENT }}
                      thumbColor="#fff"
                    />
                  </View>
                </View>

                <View style={[styles.card, styles.cardGap]}>
                  <BillRow label="Pay now" value={formatINR(payNow)} bold />
                  <BillRow
                    label="Balance on delivery / credit"
                    value={formatINR(Math.max(total - payNow, 0))}
                  />
                  {selectedPayment && (
                    <Text style={styles.hint}>Paying with {selectedPayment.label}</Text>
                  )}
                </View>
              </>
            )}
          </ScrollView>

          <View style={styles.footer}>
            {step > 0 && (
              <Pressable onPress={back} style={styles.secondaryButton}>
                <Ionicons name="arrow-back" size={20} color="#fff" />
              </Pressable>
            )}
            <Pressable
              onPress={next}
              style={({ pressed }) => [
                styles.button,
                pressed && { transform: [{ scale: 0.97 }], opacity: 0.92 },
              ]}
            >
              <Text style={styles.buttonText}>{primaryLabel}</Text>
              <Ionicons name={isLast ? "checkmark-circle" : "arrow-forward"} size={20} color={ACCENT} />
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 14,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.4,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 13,
    color: "#fff",
    opacity: 0.9,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 28,
    paddingBottom: 14,
  },
  stepCol: {
    alignItems: "center",
    width: 64,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  stepCircleOn: {
    backgroundColor: "#fff",
  },
  stepNum: {
    fontSize: 14,
    fontWeight: "800",
    color: "#fff",
  },
  stepLabel: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
    opacity: 0.7,
  },
  stepLabelOn: {
    opacity: 1,
  },
  stepLine: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    marginTop: 14,
    marginHorizontal: 4,
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  stepLineOn: {
    backgroundColor: "#fff",
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  cardGap: {
    marginTop: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: INK,
    marginBottom: 16,
  },
  fieldWrap: {
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2b3a42",
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#f1fbfd",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#d3f1f6",
    paddingHorizontal: 14,
    minHeight: 52,
  },
  inputRowMulti: {
    alignItems: "flex-start",
    paddingTop: 14,
  },
  inputRowError: {
    borderColor: DANGER,
  },
  iconTop: {
    marginTop: 1,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: INK,
    paddingVertical: 12,
  },
  inputMulti: {
    minHeight: 80,
    paddingTop: 0,
    textAlignVertical: "top",
  },
  errorText: {
    marginTop: 6,
    fontSize: 12,
    color: DANGER,
    fontWeight: "600",
  },
  hint: {
    marginTop: 10,
    fontSize: 12,
    color: MUTED,
    fontWeight: "600",
  },
  tiles: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  tile: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#d3f1f6",
    backgroundColor: "#f1fbfd",
  },
  tileActive: {
    borderColor: ACCENT,
    backgroundColor: "#e4f9fc",
  },
  tileIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  tileIconActive: {
    backgroundColor: ACCENT,
  },
  tileText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: INK,
  },
  qtyBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f1fbfd",
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#d3f1f6",
    padding: 8,
    marginBottom: 12,
  },
  qtyButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: ACCENT,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyCenter: {
    alignItems: "center",
  },
  qtyInput: {
    minWidth: 100,
    textAlign: "center",
    fontSize: 30,
    fontWeight: "800",
    color: INK,
    padding: 0,
  },
  qtyUnit: {
    fontSize: 12,
    fontWeight: "700",
    color: MUTED,
    letterSpacing: 0.5,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#d3f1f6",
    backgroundColor: "#f1fbfd",
  },
  chipActive: {
    backgroundColor: ACCENT,
    borderColor: ACCENT,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2b3a42",
  },
  chipTextActive: {
    color: "#fff",
  },
  dateRow: {
    gap: 10,
  },
  dateTile: {
    width: 64,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "#d3f1f6",
    backgroundColor: "#f1fbfd",
  },
  dateTileActive: {
    backgroundColor: ACCENT,
    borderColor: ACCENT,
  },
  dateDay: {
    fontSize: 12,
    fontWeight: "700",
    color: MUTED,
  },
  dateNum: {
    marginVertical: 2,
    fontSize: 22,
    fontWeight: "800",
    color: INK,
  },
  dateMonth: {
    fontSize: 12,
    fontWeight: "600",
    color: MUTED,
  },
  dateTextActive: {
    color: "#fff",
  },
  slotGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  slot: {
    width: "48%",
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#d3f1f6",
    backgroundColor: "#f1fbfd",
  },
  slotActive: {
    backgroundColor: ACCENT,
    borderColor: ACCENT,
  },
  slotDisabled: {
    backgroundColor: "#f0f2f3",
    borderColor: "#e3e8ea",
  },
  slotText: {
    fontSize: 14,
    fontWeight: "700",
    color: INK,
  },
  slotTextActive: {
    color: "#fff",
  },
  slotTextDisabled: {
    color: "#a3b0b6",
  },
  slotTag: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: "700",
    color: DANGER,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 16,
    backgroundColor: "#e4f9fc",
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600",
    color: "#2b3a42",
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  summaryIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#e4f9fc",
    alignItems: "center",
    justifyContent: "center",
  },
  summaryText: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: MUTED,
  },
  summaryValue: {
    marginTop: 1,
    fontSize: 14,
    fontWeight: "700",
    color: INK,
  },
  divider: {
    height: 1,
    backgroundColor: "#e3eef1",
    marginTop: 4,
    marginBottom: 14,
  },
  billRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    gap: 12,
  },
  billLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: MUTED,
  },
  billValue: {
    fontSize: 14,
    fontWeight: "700",
    color: INK,
  },
  billBold: {
    fontSize: 17,
    fontWeight: "800",
    color: INK,
  },
  payRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#d3f1f6",
    backgroundColor: "#f1fbfd",
    marginBottom: 10,
  },
  payRowActive: {
    borderColor: ACCENT,
    backgroundColor: "#e4f9fc",
  },
  payText: {
    flex: 1,
  },
  payLabel: {
    fontSize: 15,
    fontWeight: "800",
    color: INK,
  },
  payNote: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: "600",
    color: MUTED,
  },
  tokenRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e3eef1",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 8,
  },
  secondaryButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    flex: 1,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  buttonText: {
    color: ACCENT,
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
});