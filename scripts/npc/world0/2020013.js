function start() {
	if (!(cm.getJobId() == 510 || cm.getJobId() == 520)) {
		cm.sendOk("May Martin be with you.");
		cm.dispose();
		return;
	}
	if (cm.getLevel() >= 70) {
		cm.changeJobById(cm.getJobId() + 1);
		cm.sendOk("You are a freaking beast now!");
		cm.dispose();
	}
}