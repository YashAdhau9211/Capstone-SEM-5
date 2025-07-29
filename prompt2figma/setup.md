# Quick Setup Guide

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Build the Plugin
```bash
npm run build
```

### 3. Load in Figma
1. Open **Figma Desktop App**
2. Go to **Plugins** → **Development** → **Import plugin from manifest**
3. Select the `manifest.json` file in this project
4. The plugin should now appear in your development plugins list

### 4. Test the Plugin
1. Open any Figma document
2. Go to **Plugins** → **Development** → **Prompt2Figma**
3. Try one of the example prompts or type your own
4. Click "Generate Design" to see the magic happen!

## 🔧 Development Mode

For active development with auto-rebuild:

```bash
npm run dev
```

This will:
- Watch for file changes
- Automatically rebuild when you save
- Show build status in terminal

## 🎯 What You'll See

When you run the plugin, you'll get:
- A clean React interface for entering prompts
- Example prompts to try out
- Real-time feedback on generation status
- Generated UI components on your Figma canvas

## 🐛 Troubleshooting

### Plugin Not Loading?
- Make sure you ran `npm run build`
- Check that `manifest.json` is valid
- Verify Figma Desktop App is up to date

### UI Not Showing?
- Check browser console (right-click plugin window → Inspect)
- Ensure `dist/ui.js` exists after build
- Verify React dependencies are installed

### No Components Generated?
- Check the console for error messages
- Verify the sample response is working
- Test with simple prompts first

## 🔌 Next Steps

1. **Connect to Your Backend**: Update `src/utils/backendService.ts` with your MCP server URL
2. **Customize UI**: Modify `src/ui/ui.tsx` for your design preferences
3. **Add More Components**: Extend `src/utils/canvasRenderer.ts` for new node types
4. **Test with Real Prompts**: Try complex UI descriptions

## 📚 Learn More

- Check the main `README.md` for detailed documentation
- Review the code structure in `src/` directory
- Explore the TypeScript types in `src/types/`

---

**Happy Designing! 🎨** 