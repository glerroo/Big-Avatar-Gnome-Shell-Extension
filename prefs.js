/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

//Import required libraries
const { Adw, Gio, GObject, Gtk } = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;//Access to settings from schema

function init() {}

//SETTINGS WIDGETS

const settings = ExtensionUtils.getSettings();//Create a global variable to connect user settings

function makeHorizontalToggle() {
    let _horizontalToggle = new Gtk.Switch({
        active: settings.get_boolean('horizontalmode'),
        halign: Gtk.Align.END,
        valign:Gtk.Align.CENTER });
    settings.bind( 'horizontalmode', _horizontalToggle, 'state', Gio.SettingsBindFlags.DEFAULT );
    return _horizontalToggle;
}

function makeCommandBox() {
    let _commandBox = new Gtk.ComboBoxText({
        has_entry: true,
        active_id: settings.get_string('command'),
        valign:Gtk.Align.CENTER });
    _commandBox.append_text('dconf-editor');
    _commandBox.append_text('gnome-control-center user-accounts');
    _commandBox.append_text('gnome-extensions-app');
    _commandBox.append_text('gnome-help');
    _commandBox.append_text('gnome-software');
    _commandBox.append_text('gnome-system-monitor');
    _commandBox.append_text('gnome-terminal');
    settings.bind( 'command', _commandBox.get_child(), 'text', Gio.SettingsBindFlags.DEFAULT);
    return _commandBox;
}

//GTK3 WINDOW

//Create the grid
const BigAvatarSettings = new GObject.Class({
    Name: 'BigAvatarPrefs',
    Extends: Gtk.Grid,
    _init: function(params) {
        //Give grid's characteristics
        this.parent(params);
        this.column_spacing = 32;
        this.row_spacing = 16;
        this.margin_top = 16;
        this.margin_start = 32;
        this.margin_end = 32;

        //Horizontal Mode
        let horizontalLabel = new Gtk.Label({
            label: 'Horizontal Orientation',
            halign: Gtk.Align.START });
        let horizontalToggle = makeHorizontalToggle();

        this.attach(horizontalLabel, 0,0,1,1);
        this.attach(horizontalToggle, 1,0,1,1);

        //Command
        let commandLabel = new Gtk.Label({
            label: 'Launch command',
            tooltip_text: 'Pick or type a command',
            halign: Gtk.Align.START });
        let commandBox = makeCommandBox();

        this.attach(commandLabel, 0,1,1,1);
        this.attach(commandBox, 1,1,1,1);
    }
});

function buildPrefsWidget() {
    let widget = new BigAvatarSettings();
    return widget;
}

//GTK4 WINDOW

function fillPreferencesWindow(window) {
    const settings = ExtensionUtils.getSettings();

    //Create a preferences page and group
    const page = new Adw.PreferencesPage();
    window.add(page);
    const group = new Adw.PreferencesGroup();
    page.add(group);

    //Orientation Settings
    const orientationRow = new Adw.ActionRow({ title: 'Horizontal mode' });
    group.add(orientationRow);
    //Add the switch to the row
    let horizontalToggle = makeHorizontalToggle();
    orientationRow.add_suffix(horizontalToggle);
    orientationRow.activatable_widget = horizontalToggle;

    // Command Settings
    const commandRow = new Adw.ActionRow({ title: 'Launch command', subtitle: 'Pick or type a command' });
    group.add(commandRow);
    //Add the box to the row
    let commandBox = makeCommandBox();
    commandRow.add_suffix(commandBox);
    commandRow.activatable_widget = commandBox;
}
